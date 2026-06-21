import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
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
const TOKEN_FLUSH_INTERVAL_MS = 40;

let activeAbortController: AbortController | null = null;
let activeStreamCleanup: (() => void) | null = null;

const clearActiveStreamConnection = () => {
  activeAbortController = null;
  activeStreamCleanup = null;
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

export async function* readSSE(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  const cancelReader = () => {
    void reader.cancel().catch(() => undefined);
  };

  signal?.addEventListener("abort", cancelReader, { once: true });

  try {
    while (!signal?.aborted) {
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

    if (!signal?.aborted && buf) {
      const parsed = parseSSE(buf);
      if (parsed) yield parsed;
    }
  } finally {
    signal?.removeEventListener("abort", cancelReader);
    try {
      reader.releaseLock();
    } catch {
      // The browser may have already released the reader after abort/cancel.
    }
  }
}

export function useChatStream(): ChatStreamControls {
  const qc = useQueryClient();
  const isStreaming = useChatStreamStore((state) => state.isStreaming);
  const tokenBufferRef = useRef<string[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamedContentRef = useRef("");

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

  const clearFlushTimer = useCallback(() => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
  }, []);

  const resetStreamingBuffer = useCallback(() => {
    clearFlushTimer();
    tokenBufferRef.current = [];
    streamedContentRef.current = "";
  }, [clearFlushTimer]);

  const flushBufferedTokens = useCallback(() => {
    clearFlushTimer();

    const chunk = tokenBufferRef.current.join("");
    tokenBufferRef.current = [];

    if (!chunk) {
      return;
    }

    const activeStream = useChatStreamStore.getState().activeStream;
    if (!activeStream) {
      return;
    }

    streamedContentRef.current += chunk;
    appendToMessage(
      activeStream.chatId,
      activeStream.assistantMessageId,
      chunk,
    );
    useChatStreamStore
      .getState()
      .updateActiveStream({ content: streamedContentRef.current });
  }, [appendToMessage, clearFlushTimer]);

  const scheduleTokenFlush = useCallback(() => {
    if (flushTimerRef.current) {
      return;
    }

    flushTimerRef.current = setTimeout(
      flushBufferedTokens,
      TOKEN_FLUSH_INTERVAL_MS,
    );
  }, [flushBufferedTokens]);

  const stopStreaming = useCallback(() => {
    const activeStream = useChatStreamStore.getState().activeStream;

    activeStreamCleanup?.();
    resetStreamingBuffer();
    activeAbortController?.abort();

    if (activeStream) {
      markChatMessagesComplete(activeStream.chatId);
    }

    clearActiveStreamConnection();
  }, [markChatMessagesComplete, resetStreamingBuffer]);

  const sendMessage = useCallback(
    async ({
      chatId,
      content,
      model,
      webSearch,
      reasoning,
    }: StreamMessageInput) => {
      const streamStore = useChatStreamStore.getState();

      if (
        !chatId ||
        !content.trim() ||
        streamStore.activeStream ||
        activeAbortController
      ) {
        if (streamStore.activeStream || activeAbortController) {
          toast.info("Already streaming.");
        }
        return;
      }

      resetStreamingBuffer();
      const now = new Date().toISOString();
      const userMsgId = uid("user");
      const assistantMsgId = uid("assistant");
      const baseMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        createdAt: now,
        webSearch,
        reasoning,
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
      activeStreamCleanup = resetStreamingBuffer;
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
          body: JSON.stringify({
            content: content.trim(),
            model,
            webSearch,
            reasoning,
          }),
          signal: abort.signal,
        });

        if (!res.ok || !res.body)
          throw new Error(`Stream failed (${res.status})`);

        for await (const { event, data } of readSSE(res.body, abort.signal)) {
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
              flushBufferedTokens();
              replaceMessage(chatId, s.assistantMessageId, {
                ...baseMsg,
                id: serverId,
                content: streamedContentRef.current,
                status: "streaming",
              });
              useChatStreamStore
                .getState()
                .updateActiveStream({
                  assistantMessageId: serverId,
                  content: streamedContentRef.current,
                });
            }
          } else if (event === "token") {
            const chunk =
              payload?.token ?? payload?.delta ?? payload?.content ?? data;
            if (chunk) {
              tokenBufferRef.current.push(chunk);
              scheduleTokenFlush();
            }
          } else if (event === "complete") {
            flushBufferedTokens();
            const finalMsg =
              typeof payload?.message === "object" ? payload.message : payload;
            replaceMessage(chatId, s.assistantMessageId, {
              ...baseMsg,
              id: finalMsg.id ?? s.assistantMessageId,
              content: finalMsg.content ?? streamedContentRef.current,
              createdAt: finalMsg.createdAt ?? now,
              modelId: finalMsg.modelId,
              modelName: finalMsg.modelName,
              webSearch: finalMsg.webSearch ?? webSearch,
              reasoning: finalMsg.reasoning ?? reasoning,
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
        flushBufferedTokens();
        const s = useChatStreamStore.getState().activeStream;
        if (s) {
          updateMessage(chatId, s.assistantMessageId, {
            content:
              streamedContentRef.current || "Couldn't finish response. Try again.",
            error: message,
            status: "error",
          });
        }
        toast.error(message);
      } finally {
        resetStreamingBuffer();
        clearActiveStreamConnection();
      }
    },
    [
      addMessage,
      flushBufferedTokens,
      markChatMessagesComplete,
      qc,
      replaceMessage,
      resetStreamingBuffer,
      scheduleTokenFlush,
      updateMessage,
    ],
  );

  useEffect(() => () => stopStreaming(), [stopStreaming]);

  return { sendMessage, isStreaming, stopStreaming };
}
