import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import type { ChatSession } from "../types";
import { formatDate } from "@/utils/date";

interface ChatHistorySidebarProps {
  activeSessionId: string;
  sessions: ChatSession[];
  onCreateSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onSelectSession: (sessionId: string) => void;
}

export function ChatHistorySidebar({
  activeSessionId,
  sessions,
  onCreateSession,
  onDeleteSession,
  onSelectSession,
}: ChatHistorySidebarProps) {
  return (
    <aside className="flex max-h-72 w-full shrink-0 flex-col border-b border-slate-800 bg-slate-900/70 lg:max-h-none lg:h-full lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase text-cyan-300">Chats</p>
          <h2 className="truncate text-sm font-semibold text-white">
            Chat History
          </h2>
        </div>
        <button
          type="button"
          onClick={onCreateSession}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-200"
        >
          <PlusIcon size={16} />
          New
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-1">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;

            return (
              <div
                key={session.id}
                className={`group flex items-start gap-1 rounded-lg border transition-colors ${
                  isActive
                    ? "border-slate-700 bg-slate-800"
                    : "border-transparent hover:border-slate-800 hover:bg-slate-800/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectSession(session.id)}
                  className="min-w-0 flex-1 px-3 py-2 text-left"
                >
                  <span className="block truncate text-sm font-medium text-slate-100">
                    {session.title}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>{session.messages.length} messages</span>
                    <span>{formatDate(session.updatedAt)}</span>
                  </span>
                  {session.modelName ? (
                    <span className="mt-1 block truncate text-xs text-cyan-300/80">
                      {session.modelName}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  title="Delete chat"
                  aria-label="Delete chat"
                  onClick={() => onDeleteSession(session.id)}
                  className="mr-1 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 opacity-100 transition-colors hover:bg-red-500/10 hover:text-red-300 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <TrashIcon size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
