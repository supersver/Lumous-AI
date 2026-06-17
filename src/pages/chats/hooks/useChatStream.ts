import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";

import { API_URL } from "@/config";
import { auth } from "@/lib/firebase";
import { chatQueryKey } from "../api/getChat";
import { chatsQueryKey } from "../api/getChats";
import { useChatMessagesStore } from "../store/useChatMessagesStore";
import { useChatStreamStore } from "../store/useChatStreamStore";
import type {
  ChatMessage,
  ChatStreamControls,
  SSEPayload,
  StreamMessageInput,
} from "../types";

const uid = (p: string) => `${p}-${crypto.randomUUID()}`;
const streamUrl = (id: string) =>
  `${API_URL?.replace(/\/$/, "")}/chats/${encodeURIComponent(id)}/messages/stream`;

let activeAbortController: AbortController | null = null;

const clearActiveStreamConnection = () => {
  activeAbortController = null;
  useChatStreamStore.getState().clearActiveStream();
};

export const parseSSE = (raw: string) => {
  let event = "message",
    data = "";
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:"))
      data += (data ? "\n" : "") + line.slice(5).trimStart();
  }
  return data || event !== "message" ? { event, data } : null;
};

export async function* readSSE(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buf += decoder.decode(value, { stream: true });
    const parts = buf.split(/\r?\n\r?\n/);
    buf = parts.pop() || "";

    for (const part of parts) {
      const parsed = parseSSE(part);
      if (parsed) yield parsed;
    }
  }

  if (buf) {
    const parsed = parseSSE(buf);
    if (parsed) yield parsed;
  }
}

export function useChatStream(): ChatStreamControls {
  const qc = useQueryClient();
  const isStreaming = useChatStreamStore((state) => state.isStreaming);

  const {
    addMessage,
    appendToMessage,
    markChatMessagesComplete,
    replaceMessage,
    updateMessage,
  } = useChatMessagesStore(
    useShallow((s) => ({
      addMessage: s.addMessage,
      appendToMessage: s.appendToMessage,
      markChatMessagesComplete: s.markChatMessagesComplete,
      replaceMessage: s.replaceMessage,
      updateMessage: s.updateMessage,
    })),
  );

  const stopStreaming = useCallback(() => {
    const activeStream = useChatStreamStore.getState().activeStream;

    activeAbortController?.abort();

    if (activeStream) {
      markChatMessagesComplete(activeStream.chatId);
    }

    clearActiveStreamConnection();
  }, [markChatMessagesComplete]);

  const sendMessage = useCallback(
    async ({ chatId, content, model }: StreamMessageInput) => {
      const streamStore = useChatStreamStore.getState();

      if (!chatId || !content.trim() || streamStore.activeStream) {
        if (streamStore.activeStream) toast.info("Already streaming.");
        return;
      }

      const now = new Date().toISOString();
      const userMsgId = uid("user");
      const assistantMsgId = uid("assistant");
      const baseMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        createdAt: now,
        status: "streaming",
      };

      addMessage(chatId, {
        id: userMsgId,
        role: "user",
        content: content.trim(),
        createdAt: now,
        status: "optimistic",
      });
      addMessage(chatId, baseMsg);

      const abort = new AbortController();
      activeAbortController = abort;
      streamStore.startStream({
        chatId,
        assistantMessageId: assistantMsgId,
        userMessageId: userMsgId,
        content: "",
      });

      try {
        const token = await auth.currentUser?.getIdToken(true);
        const res = await fetch(streamUrl(chatId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ content: content.trim(), model }),
          signal: abort.signal,
        });

        if (!res.ok || !res.body)
          throw new Error(`Stream failed (${res.status})`);

        for await (const { event, data } of readSSE(res.body)) {
          const s = useChatStreamStore.getState().activeStream;
          if (!s) break;

          let payload: SSEPayload = {};
          try {
            payload = data ? JSON.parse(data) : {};
          } catch (error) {
            console.log(error);
          }

          if (event === "start") {
            const serverId =
              payload?.assistantMessageId ?? payload?.messageId ?? payload?.id;
            if (serverId) {
              replaceMessage(chatId, s.assistantMessageId, {
                ...baseMsg,
                id: serverId,
              });
              useChatStreamStore
                .getState()
                .updateActiveStream({ assistantMessageId: serverId });
            }
          } else if (event === "token") {
            const chunk =
              payload?.token ?? payload?.delta ?? payload?.content ?? data;
            const nextContent = `${s.content}${chunk}`;
            appendToMessage(chatId, s.assistantMessageId, chunk);
            useChatStreamStore
              .getState()
              .updateActiveStream({ content: nextContent });
          } else if (event === "complete") {
            const finalMsg =
              typeof payload?.message === "object" ? payload.message : payload;
            replaceMessage(chatId, s.assistantMessageId, {
              ...baseMsg,
              id: finalMsg.id ?? s.assistantMessageId,
              content: finalMsg.content ?? s.content,
              createdAt: finalMsg.createdAt ?? now,
              modelId: finalMsg.modelId,
              modelName: finalMsg.modelName,
              status: "complete",
            });
            updateMessage(chatId, s.userMessageId, { status: "complete" });
            break;
          } else if (event === "error") {
            throw new Error(
              payload?.error ??
                (typeof payload?.message === "string"
                  ? payload.message
                  : payload?.message?.content) ??
                "Stream error",
            );
          }
        }

        if (abort.signal.aborted) return;

        markChatMessagesComplete(chatId);
        await Promise.all([
          qc.invalidateQueries({ queryKey: chatQueryKey(chatId) }),
          qc.invalidateQueries({ queryKey: chatsQueryKey }),
        ]);
      } catch (err: unknown) {
        if (abort.signal.aborted || (err instanceof Error && err.name === "AbortError")) {
          return;
        }

        const message = err instanceof Error ? err.message : "Stream failed";
        const s = useChatStreamStore.getState().activeStream;
        if (s) {
          updateMessage(chatId, s.assistantMessageId, {
            content: s.content || "Couldn't finish response. Try again.",
            error: message,
            status: "error",
          });
        }
        toast.error(message);
      } finally {
        clearActiveStreamConnection();
      }
    },
    [
      addMessage,
      appendToMessage,
      markChatMessagesComplete,
      qc,
      replaceMessage,
      updateMessage,
    ],
  );

  useEffect(() => () => stopStreaming(), [stopStreaming]);

  return { sendMessage, isStreaming, stopStreaming };
}
