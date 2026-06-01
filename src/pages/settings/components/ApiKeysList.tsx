import { KeyIcon, SpinnerGapIcon, TrashIcon } from "@phosphor-icons/react";

import type { ApiKey } from "../api/types";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  deletingKeyId: string | null;
  isLoading: boolean;
  providerLabels: Record<string, string>;
  onDelete: (id: string) => void;
}

const maskKey = (value: string) => {
  if (value.includes("*")) {
    return value;
  }

  if (value.length <= 8) {
    return "****";
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
};

const getKeyPreview = (apiKey: ApiKey) => {
  if (apiKey.maskedKey) {
    return apiKey.maskedKey;
  }

  if (apiKey.keyPreview) {
    return apiKey.keyPreview;
  }

  if (apiKey.preview) {
    return apiKey.preview;
  }

  if (apiKey.lastFour) {
    return `**** ${apiKey.lastFour}`;
  }

  if (apiKey.key) {
    return maskKey(apiKey.key);
  }

  return "Saved key";
};

const formatDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

function LoadingKeys() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="h-18.5 animate-pulse rounded-lg border border-slate-800 bg-slate-950"
        />
      ))}
    </div>
  );
}

export function ApiKeysList({
  apiKeys,
  deletingKeyId,
  isLoading,
  providerLabels,
  onDelete,
}: ApiKeysListProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Existing keys</h2>
          <p className="text-sm text-slate-400">{apiKeys.length} saved</p>
        </div>
        <div className="grid size-10 place-items-center rounded-lg bg-indigo-400/10 text-indigo-300">
          <KeyIcon size={20} weight="duotone" />
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <LoadingKeys />
        ) : apiKeys.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-200">
              No API keys saved
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((apiKey) => {
              const createdAt = formatDate(apiKey.createdAt);
              const isDeleting = deletingKeyId === apiKey.id;

              return (
                <div
                  key={apiKey.id}
                  className="flex min-h-18.5 items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold text-slate-100">
                        {providerLabels[apiKey.provider] ?? apiKey.provider}
                      </p>
                      {apiKey.name ? (
                        <span className="text-xs text-slate-500">
                          {apiKey.name}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate font-mono text-sm text-slate-400">
                      {getKeyPreview(apiKey)}
                    </p>
                    {createdAt ? (
                      <p className="mt-1 text-xs text-slate-600">
                        Added {createdAt}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => onDelete(apiKey.id)}
                    aria-label={`Delete ${
                      providerLabels[apiKey.provider] ?? apiKey.provider
                    } API key`}
                    className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? (
                      <SpinnerGapIcon size={18} className="animate-spin" />
                    ) : (
                      <TrashIcon size={18} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
