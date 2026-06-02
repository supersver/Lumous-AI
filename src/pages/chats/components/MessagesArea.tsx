import type { RefObject } from "react";
import type { ChatSession } from "../types";
import { MessageBubble } from "./MessageBubble";
import { ChatCircleIcon } from "@phosphor-icons/react";

interface MessagesAreaProps {
  bottomRef: RefObject<HTMLDivElement | null>;
  session: ChatSession | undefined;
  userInitial: string;
}

export function MessagesArea({
  bottomRef,
  session,
  userInitial,
}: MessagesAreaProps) {
  if (!session || session.messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-sm text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-indigo-300">
            <ChatCircleIcon size={22} weight="duotone" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">
            No messages yet
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Your next conversation will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        {session.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            userInitial={userInitial}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
