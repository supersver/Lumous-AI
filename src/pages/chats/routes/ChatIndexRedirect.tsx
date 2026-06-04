import { useNavigate } from "react-router-dom";

import { useAppStore } from "@/store/useAppStore";
import { useChatSessions } from "../context/ChatSessionsContext";

export function ChatIndexRedirect() {
  const navigate = useNavigate();
  const selectedModel = useAppStore((s) => s.selectedModel);
  const { createSession } = useChatSessions();

  const handleNewChat = async () => {
    const sessionId = await createSession(selectedModel?.id ?? "");
    navigate(`/chat/${sessionId}`);
  };

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 220 180"
          className="h-44 w-56 max-w-full"
          fill="none"
        >
          <path
            d="M54 118c-14.36 0-26-11.64-26-26V58c0-14.36 11.64-26 26-26h112c14.36 0 26 11.64 26 26v34c0 14.36-11.64 26-26 26h-42.5L92 146v-28H54Z"
            className="fill-slate-900 stroke-slate-700"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M72 72h76M72 92h48"
            className="stroke-slate-500"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="m164 30 4.76 12.24L181 47l-12.24 4.76L164 64l-4.76-12.24L147 47l12.24-4.76L164 30ZM49 26l2.98 7.52L59.5 36.5l-7.52 2.98L49 47l-2.98-7.52-7.52-2.98 7.52-2.98L49 26Z"
            className="fill-indigo-400"
          />
          <circle cx="68" cy="134" r="8" className="fill-cyan-400" />
          <circle cx="181" cy="126" r="5" className="fill-emerald-400" />
        </svg>

        <h1 className="mt-6 text-xl font-semibold text-slate-100">
          Start a conversation
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Create a new chat and pick up with your selected model.
        </p>
        <button
          type="button"
          onClick={handleNewChat}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          New Chat
        </button>
      </div>
    </div>
  );
}
