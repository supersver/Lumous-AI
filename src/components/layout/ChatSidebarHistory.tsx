import type { MouseEvent } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";

import { useChatSessions } from "@/pages/chats/context/ChatSessionsContext";
import { formatDate } from "@/utils/date";

export function ChatSidebarHistory() {
  const navigate = useNavigate();
  const { id: activeRouteId } = useParams();
  const { createSession, deleteSession, sessions } = useChatSessions();

  const handleNewChat = () => {
    const sessionId = createSession();
    navigate(`/chat/${sessionId}`);
  };

  const handleDeleteChat = (
    event: MouseEvent<HTMLButtonElement>,
    sessionId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const nextSessionId = deleteSession(sessionId);

    if (activeRouteId === sessionId) {
      navigate(`/chat/${nextSessionId}`, { replace: true });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <button
        type="button"
        onClick={handleNewChat}
        className="flex w-full items-center gap-3 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-500/50 hover:bg-slate-800/60 hover:text-cyan-100"
      >
        <PlusIcon size={18} />
        New chat
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-0.5 pr-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="group relative flex items-stretch rounded-lg"
            >
              <NavLink
                to={`/chat/${session.id}`}
                className={({ isActive }) =>
                  `min-w-0 flex-1 rounded-lg px-3 py-2 text-left transition-colors ${
                    isActive
                      ? "bg-slate-800 text-slate-100"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`
                }
              >
                <span className="block truncate text-sm font-medium">
                  {session.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {session.messages.length} messages ·{" "}
                  {formatDate(session.updatedAt)}
                </span>
              </NavLink>
              <button
                type="button"
                title="Delete chat"
                aria-label="Delete chat"
                onClick={(event) => handleDeleteChat(event, session.id)}
                className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
