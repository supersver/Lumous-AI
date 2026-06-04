import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatsQueryKey, useGetChats } from "../api/getChats";
import { useGetChat } from "../api/getChat";
import { useCreateNewChat } from "../api/createNewChat";
import { useDeleteChat } from "../api/deleteChat";
import { useSendMessage } from "../api/sendMessage";
import type { ChatModelSnapshot } from "../types";

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

  const createChatMutation = useCreateNewChat();
  const deleteChatMutation = useDeleteChat();
  const { mutateAsync: sendMessageMutation, isPending: isSending } =
    useSendMessage();

  const createSession = useCallback(
    async (modelId: string): Promise<string> => {
      const newChat = await createChatMutation.mutateAsync({ model: modelId });
      setActiveSessionId(newChat.id);
      return newChat.id;
    },
    [createChatMutation],
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
        setActiveSessionId(nextId);
        return nextId || null;
      } finally {
        deletingSessionIdsRef.current.delete(sessionId);
      }
    },
    [deleteChatMutation, sessions, activeSessionId],
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
      });

      await queryClient.invalidateQueries({ queryKey: chatsQueryKey });
    },
    [activeSessionId, sendMessageMutation, createChatMutation, queryClient],
  );

  return {
    activeSession,
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
