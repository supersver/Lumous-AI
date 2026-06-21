import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatsQueryKey, useGetChats } from "../api/getChats";
import { useGetChat } from "../api/getChat";
import { useCreateNewChat } from "../api/createNewChat";
import { useDeleteChat } from "../api/deleteChat";
import { useSendMessage } from "../api/sendMessage";
import { useChatMessagesStore } from "../store/useChatMessagesStore";
import type { ChatMessage, ChatModelSnapshot } from "../types";

export function useChatSessionsState() {
  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const deletingSessionIdsRef = useRef(new Set<string>());

  const { data: chatsData, isLoading } = useGetChats();
  const sessions = useMemo(() => chatsData ?? [], [chatsData]);

  useEffect(() => {
    if (sessions.length === 0) {
      if (activeSessionId) {
        setActiveSessionId("");
      }
      return;
    }

    const activeSessionExists = sessions.some(
      (session) => session.id === activeSessionId,
    );

    if (!activeSessionId || !activeSessionExists) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  const { data: activeSession } = useGetChat(activeSessionId, {
    enabled: !!activeSessionId,
  });
  const activeMessageMap = useChatMessagesStore((state) =>
    activeSessionId ? state.messagesByChatId[activeSessionId] : undefined,
  );
  const activeMessageOrder = useChatMessagesStore((state) =>
    activeSessionId ? state.messageOrderByChatId[activeSessionId] : undefined,
  );
  const clearChatMessages = useChatMessagesStore(
    (state) => state.clearChatMessages,
  );
  const setChatMessagesFromServer = useChatMessagesStore(
    (state) => state.setChatMessagesFromServer,
  );

  useEffect(() => {
    if (!activeSession) {
      return;
    }

    setChatMessagesFromServer(activeSession.id, activeSession.messages);
  }, [activeSession, setChatMessagesFromServer]);

  const mergedActiveSession = useMemo(() => {
    if (!activeSession) {
      return undefined;
    }

    if (!activeMessageMap || !activeMessageOrder) {
      return activeSession;
    }

    return {
      ...activeSession,
      messages: activeMessageOrder
        .map((messageId) => activeMessageMap[messageId])
        .filter((message): message is ChatMessage => Boolean(message)),
    };
  }, [activeMessageMap, activeMessageOrder, activeSession]);

  const createChatMutation = useCreateNewChat();
  const deleteChatMutation = useDeleteChat();
  const { mutateAsync: sendMessageMutation, isPending: isSending } =
    useSendMessage();

  const createSession = useCallback(
    async (modelId: string): Promise<string> => {
      const newChat = await createChatMutation.mutateAsync({ model: modelId });
      setActiveSessionId(newChat.id);
      await queryClient.invalidateQueries({ queryKey: chatsQueryKey });

      return newChat.id;
    },
    [createChatMutation, queryClient],
  );

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const deleteSession = useCallback(
    async (sessionId: string): Promise<string | null> => {
      if (deletingSessionIdsRef.current.has(sessionId)) {
        return activeSessionId === sessionId ? null : activeSessionId;
      }

      deletingSessionIdsRef.current.add(sessionId);

      const remainingSessions = sessions.filter((s) => s.id !== sessionId);
      const nextId =
        activeSessionId === sessionId
          ? (remainingSessions[0]?.id ?? "")
          : activeSessionId;

      try {
        await deleteChatMutation.mutateAsync(sessionId);
        clearChatMessages(sessionId);
        setActiveSessionId(nextId);
        return nextId || null;
      } finally {
        deletingSessionIdsRef.current.delete(sessionId);
      }
    },
    [clearChatMessages, deleteChatMutation, sessions, activeSessionId],
  );

  const sendMessage = useCallback(
    async (content: string, model: ChatModelSnapshot | null) => {
      const trimmedContent = content.trim();
      if (!trimmedContent) return;

      let chatId = activeSessionId;

      if (!chatId) {
        const newChat = await createChatMutation.mutateAsync({
          model: model?.id ?? "",
        });
        chatId = newChat.id;
      }

      await sendMessageMutation({
        chatId,
        content: trimmedContent,
        model: model?.id ?? "",
        webSearch: false,
        reasoning: false,
      });

      await queryClient.invalidateQueries({ queryKey: chatsQueryKey });
    },
    [activeSessionId, sendMessageMutation, createChatMutation, queryClient],
  );

  return {
    activeSession: mergedActiveSession,
    activeSessionId,
    createSession,
    deleteSession,
    selectSession,
    sendMessage,
    sessions,
    isLoading,
    isSending,
  };
}
