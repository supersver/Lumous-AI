import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatMessage, ChatModelSnapshot, ChatSession } from "../types";

const CHAT_SESSIONS_STORAGE_KEY = "modelpilot_chat_sessions";

interface ChatSessionsState {
  activeSessionId: string;
  sessions: ChatSession[];
}

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createBlankSession = (): ChatSession => {
  const now = new Date().toISOString();

  return {
    id: createId(),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
};

const makeTitle = (content: string) => {
  const title = content.trim().replace(/\s+/g, " ").split(" ").slice(0, 7);
  return title.join(" ") || "New chat";
};

const isChatSession = (value: unknown): value is ChatSession => {
  if (!value || typeof value !== "object") return false;

  const session = value as Partial<ChatSession>;
  return (
    typeof session.id === "string" &&
    typeof session.title === "string" &&
    typeof session.createdAt === "string" &&
    typeof session.updatedAt === "string" &&
    Array.isArray(session.messages)
  );
};

const sortSessions = (sessions: ChatSession[]) => {
  return [...sessions].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
};

const readStoredSessions = (): ChatSession[] => {
  if (typeof window === "undefined") {
    return [createBlankSession()];
  }

  try {
    const storedSessions = window.localStorage.getItem(
      CHAT_SESSIONS_STORAGE_KEY,
    );

    if (!storedSessions) {
      return [createBlankSession()];
    }

    const parsedSessions = JSON.parse(storedSessions);
    const sessions = Array.isArray(parsedSessions)
      ? parsedSessions.filter(isChatSession)
      : [];

    return sessions.length > 0
      ? sortSessions(sessions)
      : [createBlankSession()];
  } catch {
    return [createBlankSession()];
  }
};

const createInitialState = (): ChatSessionsState => {
  const sessions = readStoredSessions();

  return {
    activeSessionId: sessions[0].id,
    sessions,
  };
};

export function useChatSessionsState() {
  const [state, setState] = useState<ChatSessionsState>(createInitialState);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      CHAT_SESSIONS_STORAGE_KEY,
      JSON.stringify(state.sessions),
    );
  }, [state.sessions]);

  const activeSession = useMemo(() => {
    return state.sessions.find(
      (session) => session.id === state.activeSessionId,
    );
  }, [state.activeSessionId, state.sessions]);

  const createSession = useCallback((): string => {
    const session = createBlankSession();

    setState((currentState) => ({
      activeSessionId: session.id,
      sessions: [session, ...currentState.sessions],
    }));

    return session.id;
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    setState((currentState) => ({
      ...currentState,
      activeSessionId: sessionId,
    }));
  }, []);

  const deleteSession = useCallback((sessionId: string): string => {
    let nextActiveSessionId = sessionId;

    setState((currentState) => {
      const remainingSessions = currentState.sessions.filter(
        (session) => session.id !== sessionId,
      );

      if (remainingSessions.length === 0) {
        const session = createBlankSession();
        nextActiveSessionId = session.id;

        return {
          activeSessionId: session.id,
          sessions: [session],
        };
      }

      nextActiveSessionId =
        currentState.activeSessionId === sessionId
          ? remainingSessions[0].id
          : currentState.activeSessionId;

      return {
        activeSessionId: nextActiveSessionId,
        sessions: remainingSessions,
      };
    });

    return nextActiveSessionId;
  }, []);

  const sendMessage = useCallback(
    (content: string, model: ChatModelSnapshot | null) => {
      const trimmedContent = content.trim();

      if (!trimmedContent) return;

      const now = new Date().toISOString();
      const message: ChatMessage = {
        id: createId(),
        role: "user",
        content: trimmedContent,
        createdAt: now,
        modelId: model?.id,
        modelName: model?.name,
      };

      setState((currentState) => {
        const hasActiveSession = currentState.sessions.some(
          (session) => session.id === currentState.activeSessionId,
        );
        const fallbackSession = hasActiveSession ? null : createBlankSession();
        const activeSessionId =
          fallbackSession?.id ?? currentState.activeSessionId;
        const sessions = fallbackSession
          ? [fallbackSession, ...currentState.sessions]
          : currentState.sessions;

        const updatedSessions = sessions.map((session) => {
          if (session.id !== activeSessionId) return session;

          const shouldUsePromptTitle =
            session.messages.length === 0 || session.title === "New chat";

          return {
            ...session,
            title: shouldUsePromptTitle
              ? makeTitle(trimmedContent)
              : session.title,
            updatedAt: now,
            modelName: model?.name ?? session.modelName,
            messages: [...session.messages, message],
          };
        });

        return {
          activeSessionId,
          sessions: sortSessions(updatedSessions),
        };
      });
    },
    [],
  );

  return {
    activeSession,
    activeSessionId: state.activeSessionId,
    createSession,
    deleteSession,
    selectSession,
    sendMessage,
    sessions: state.sessions,
  };
}
