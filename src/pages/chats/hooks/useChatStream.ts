import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";

import { API_URL } from "@/config";
import { auth } from "@/lib/firebase";
import { chatQueryKey } from "../api/getChat";
import { chatsQueryKey } from "../api/getChats";
import { useChatMessagesStore } from "../store/useChatMessagesStore";
import type {
  ChatMessage,
  ChatStreamCompletePayload,
  ChatStreamErrorPayload,
  ChatStreamStartPayload,
  ChatStreamTokenPayload,
  StreamMessageInput,
} from "../types";

const streamUrl = (chatId: string) =>
  `${API_URL?.replace(/\/$/, "") ?? ""}/chats/${encodeURIComponent(chatId)}/messages/stream`;

const uid = (prefix: string) =>
  `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;

const parseEvent = (raw: string) => {
  let event = "message";
  const data: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
  }
  return data.length || event !== "message"
    ? { event, data: data.join("\n") }
    : null;
};

const tryJson = <T>(s: string): T | null => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

const invalidateChat = (
  qc: ReturnType<typeof useQueryClient>,
  chatId: string,
) =>
  Promise.all([
    qc.invalidateQueries({ queryKey: chatQueryKey(chatId) }),
    qc.invalidateQueries({ queryKey: chatsQueryKey }),
  ]);

export function useChatStream() {
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const streamingRef = useRef(false);
  const msgIdRef = useRef<string | null>(null);
  const contentRef = useRef("");

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

  const reset = useCallback(() => {
    abortRef.current = null;
    msgIdRef.current = null;
    contentRef.current = "";
    streamingRef.current = false;
    setIsStreaming(false);
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    reset();
  }, [reset]);

  const sendMessage = useCallback(
    async ({ chatId, content, model }: StreamMessageInput) => {
      const text = content.trim();
      if (!chatId || !text) return;
      if (streamingRef.current) {
        toast.info("A response is already streaming.");
        return;
      }

      const now = new Date().toISOString();
      const assistantId = uid("assistant");
      const assistantBase: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: now,
        status: "streaming",
      };
      const abort = new AbortController();

      addMessage(chatId, {
        id: uid("user"),
        role: "user",
        content: text,
        createdAt: now,
        status: "optimistic",
      });
      addMessage(chatId, assistantBase);
      msgIdRef.current = assistantId;
      contentRef.current = "";
      abortRef.current = abort;
      streamingRef.current = true;
      setIsStreaming(true);

      try {
        const token = await auth.currentUser?.getIdToken(true);
        const res = await fetch(streamUrl(chatId), {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content: text, model }),
          signal: abort.signal,
        });

        if (!res.ok)
          throw new Error(`Streaming request failed (${res.status}).`);
        if (!res.body) throw new Error("Streaming response was empty.");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value ?? new Uint8Array(), {
            stream: !done,
          });
          const chunks = buffer.split(/\r?\n\r?\n/);
          buffer = chunks.pop() ?? "";

          for (const raw of chunks) {
            const parsed = parseEvent(raw);
            if (!parsed) continue;
            const { event, data } = parsed;

            if (event === "start") {
              const p = tryJson<ChatStreamStartPayload>(data);
              const serverId = p?.assistantMessageId ?? p?.messageId ?? p?.id;
              if (serverId && msgIdRef.current) {
                replaceMessage(chatId, msgIdRef.current, {
                  ...assistantBase,
                  id: serverId,
                });
                msgIdRef.current = serverId;
              }
            } else if (event === "token") {
              const p = tryJson<ChatStreamTokenPayload>(data);
              const chunk = p?.token ?? p?.delta ?? p?.content ?? data;
              if (msgIdRef.current) {
                contentRef.current += chunk;
                appendToMessage(chatId, msgIdRef.current, chunk);
              }
            } else if (event === "complete") {
              const p = tryJson<ChatStreamCompletePayload>(data);
              const final = p?.message;
              if (msgIdRef.current) {
                replaceMessage(chatId, msgIdRef.current, {
                  id: final?.id ?? p?.messageId ?? p?.id ?? msgIdRef.current,
                  role: "assistant",
                  content: final?.content ?? p?.content ?? contentRef.current,
                  createdAt: final?.createdAt ?? now,
                  modelId: final?.modelId,
                  modelName: final?.modelName,
                  status: "complete",
                });
              }
              markChatMessagesComplete(chatId);
              await invalidateChat(queryClient, chatId);
              stopStreaming();
              return;
            } else if (event === "error") {
              const p = tryJson<ChatStreamErrorPayload>(data);
              throw new Error(p?.message ?? p?.error ?? "Streaming failed.");
            }
          }

          if (done) break;
        }

        if (msgIdRef.current)
          updateMessage(chatId, msgIdRef.current, {
            content: contentRef.current,
            status: "complete",
          });
        markChatMessagesComplete(chatId);
        await invalidateChat(queryClient, chatId);
      } catch (error) {
        if (abort.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : "Streaming failed.";
        if (msgIdRef.current) {
          updateMessage(chatId, msgIdRef.current, {
            content:
              contentRef.current ||
              "I couldn't finish that response. Please try again.",
            error: message,
            status: "error",
          });
        }
        toast.error(message);
      } finally {
        if (abortRef.current === abort) reset();
      }
    },
    [
      addMessage,
      appendToMessage,
      markChatMessagesComplete,
      queryClient,
      replaceMessage,
      stopStreaming,
      updateMessage,
      reset,
    ],
  );

  useEffect(
    () => () => {
      abortRef.current?.abort();
      reset();
    },
    [reset],
  );

  return { sendMessage, isStreaming, stopStreaming };
}
