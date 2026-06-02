import { SpinnerGapIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useAppStore } from "@/store/useAppStore";
import { useGetModels } from "../api/getModels";
import { useChatSessions } from "../context/ChatSessionsContext";
import { ModelSelector } from "../components/ModelSelector";
import { PromptInput } from "../components/PromptInput";
import { MessagesArea } from "../components/MessagesArea";

export function Chats() {
  const { id: chatId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<string>("");
  const { user, selectedModel, setSelectedModel } = useAppStore(
    useShallow((state) => ({
      user: state.user,
      selectedModel: state.selectedModel,
      setSelectedModel: state.setSelectedModel,
    })),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modelsQuery = useGetModels();
  const models = modelsQuery.data ?? [];
  const {
    activeSession,
    activeSessionId,
    createSession,
    selectSession,
    sendMessage,
    sessions,
  } = useChatSessions();

  useEffect(() => {
    if (!chatId) return;

    const sessionExists = sessions.some((session) => session.id === chatId);

    if (!sessionExists) {
      const fallbackId = sessions[0]?.id ?? createSession();
      navigate(`/chat/${fallbackId}`, { replace: true });
      return;
    }

    if (activeSessionId !== chatId) {
      selectSession(chatId);
    }
  }, [
    activeSessionId,
    chatId,
    createSession,
    navigate,
    selectSession,
    sessions,
  ]);

  useEffect(() => {
    if (models.length === 0) return;

    const selectedModelExists = models.some(
      (model) => model.id === selectedModel?.id,
    );

    if (!selectedModelExists) {
      const firstModel = models[0];
      setSelectedModel({ id: firstModel.id, name: firstModel.name });
    }
  }, [models, selectedModel?.id, setSelectedModel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.id, activeSession?.messages.length]);

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "M";
  const canSend = draft.trim().length > 0 && Boolean(selectedModel);

  const handleSendPrompt = () => {
    if (!canSend) return;

    sendMessage(draft, selectedModel);
    setDraft("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-100">
      <section className="flex min-h-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-slate-800 bg-slate-950/95 px-4 py-4 sm:px-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-indigo-300">
              <UserCircleIcon size={22} weight="duotone" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase text-cyan-300">
                ModelPilot
              </p>
              <h1 className="truncate text-2xl font-semibold text-white">
                {activeSession?.title ?? "New chat"}
              </h1>
              <p className="mt-1 truncate text-sm text-slate-500">
                {activeSession?.messages.length ?? 0} messages
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between xl:justify-end">
            <ModelSelector
              isError={modelsQuery.isError}
              isLoading={modelsQuery.isLoading}
              models={models}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
            {modelsQuery.isLoading ? (
              <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-800 px-3 text-sm text-slate-400">
                <SpinnerGapIcon size={16} className="animate-spin" />
                Loading
              </div>
            ) : null}
          </div>
        </header>

        <MessagesArea
          bottomRef={messagesEndRef}
          session={activeSession}
          userInitial={userInitial}
        />

        <PromptInput
          canSend={canSend}
          draft={draft}
          selectedModelName={selectedModel?.name}
          onDraftChange={setDraft}
          onSend={handleSendPrompt}
        />
      </section>
    </div>
  );
}
