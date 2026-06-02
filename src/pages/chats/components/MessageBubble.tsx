import { RobotIcon } from "@phosphor-icons/react";
import type { ChatMessage } from "../types";
import { formatTime } from "@/utils/time";

interface MessageBubbleProps {
  message: ChatMessage;
  userInitial: string;
}

export function MessageBubble({ message, userInitial }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${
          isUser
            ? "border-cyan-500/30 bg-cyan-400/10 text-cyan-200"
            : "border-indigo-500/30 bg-indigo-400/10 text-indigo-200"
        }`}
      >
        {isUser ? (
          <span className="text-sm font-semibold">{userInitial}</span>
        ) : (
          <RobotIcon size={18} weight="duotone" />
        )}
      </div>

      <div className={`min-w-0 max-w-3xl ${isUser ? "text-right" : ""}`}>
        <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
          <span>{isUser ? "You" : "ModelPilot"}</span>
          <span>{formatTime(message.createdAt)}</span>
          {message.modelName ? <span>{message.modelName}</span> : null}
        </div>
        <div
          className={`whitespace-pre-wrap rounded-lg border px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? "border-cyan-500/20 bg-cyan-500/10 text-slate-100"
              : "border-slate-800 bg-slate-900 text-slate-200"
          }`}
        >
          {message.content}
        </div>
      </div>
    </article>
  );
}
