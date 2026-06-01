import type { FormEvent } from "react";
import { FloppyDiskIcon, KeyIcon, SpinnerGapIcon } from "@phosphor-icons/react";

import type { ApiKeyProvider } from "../api/types";
import { ProviderSelect, type ProviderOption } from "./ProviderSelect";

interface ApiKeyFormProps {
  apiKey: string;
  isSaving: boolean;
  provider: ApiKeyProvider;
  providerOptions: ProviderOption[];
  onApiKeyChange: (apiKey: string) => void;
  onProviderChange: (provider: ApiKeyProvider) => void;
  onSubmit: () => void;
}

export function ApiKeyForm({
  apiKey,
  isSaving,
  provider,
  providerOptions,
  onApiKeyChange,
  onProviderChange,
  onSubmit,
}: ApiKeyFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/20">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
          <KeyIcon size={20} weight="duotone" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Add API key</h2>
          <p className="text-sm text-slate-400">Provider credentials</p>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <ProviderSelect
          value={provider}
          options={providerOptions}
          disabled={isSaving}
          onChange={onProviderChange}
        />

        <label className="block">
          <span className="text-sm font-medium text-slate-300">API key</span>
          <input
            type="password"
            value={apiKey}
            disabled={isSaving}
            onChange={(event) => onApiKeyChange(event.target.value)}
            placeholder="sk-or-v1-..."
            autoComplete="off"
            className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </label>

        <button
          type="submit"
          disabled={isSaving || !apiKey.trim()}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <SpinnerGapIcon size={18} className="animate-spin" />
          ) : (
            <FloppyDiskIcon size={18} weight="bold" />
          )}
          {isSaving ? "Saving..." : "Save key"}
        </button>
      </form>
    </section>
  );
}
