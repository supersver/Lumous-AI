import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import type { KeyboardEvent } from "react";

interface PromptInputProps {
  canSend: boolean;
  draft: string;
  selectedModelName?: string;
  onDraftChange: (draft: string) => void;
  onSend: () => void;
}

export function PromptInput({
  canSend,
  draft,
  selectedModelName,
  onDraftChange,
  onSend,
}: PromptInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-4 sm:px-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
        className="mx-auto flex w-full max-w-4xl items-end gap-3"
      >
        <textarea
          value={draft}
          rows={1}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedModelName
              ? `Ask ${selectedModelName}`
              : "Select a model to chat"
          }
          className="max-h-44 min-h-12 flex-1 resize-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition-colors placeholder:text-slate-500 hover:border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
        />
        <button
          type="submit"
          disabled={!canSend}
          title="Send prompt"
          aria-label="Send prompt"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-cyan-400 text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
        >
          <PaperPlaneTiltIcon size={20} weight="fill" />
        </button>
      </form>
    </div>
  );
}
