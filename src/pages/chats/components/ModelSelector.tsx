import { useMemo } from "react";
import type { Model } from "../api/getModels";
import type { SelectedModel } from "@/store/useAppStore";
import { WarningCircleIcon } from "@phosphor-icons/react";

interface ModelSelectorProps {
  isError: boolean;
  isLoading: boolean;
  models: Model[];
  selectedModel: SelectedModel | null;
  onModelChange: (model: SelectedModel | null) => void;
}

const numberFormatter = new Intl.NumberFormat();

const formatContextLength = (contextLength: number) => {
  return numberFormatter.format(contextLength);
};

export function ModelSelector({
  isError,
  isLoading,
  models,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const activeModel = useMemo(() => {
    return models.find((model) => model.id === selectedModel?.id) ?? null;
  }, [models, selectedModel?.id]);

  const handleModelChange = (modelId: string) => {
    const model = models.find((item) => item.id === modelId);
    onModelChange(model ? { id: model.id, name: model.name } : null);
  };

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label
        htmlFor="chat-model"
        className="text-xs font-medium uppercase text-slate-500"
      >
        Model
      </label>
      <select
        id="chat-model"
        value={selectedModel?.id ?? ""}
        disabled={isLoading || isError || models.length === 0}
        onChange={(event) => handleModelChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-medium text-slate-100 outline-none transition-colors hover:border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-80"
      >
        <option value="">
          {isLoading
            ? "Loading models..."
            : isError
              ? "Models unavailable"
              : "Select model"}
        </option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {formatContextLength(model.contextLength)} context
          </option>
        ))}
      </select>
      <div className="min-h-5 text-xs text-slate-500">
        {activeModel ? (
          <span>{formatContextLength(activeModel.contextLength)} tokens</span>
        ) : null}
        {isError ? (
          <span className="flex items-center gap-1 text-red-300">
            <WarningCircleIcon size={14} />
            Could not load models.
          </span>
        ) : null}
      </div>
    </div>
  );
}
