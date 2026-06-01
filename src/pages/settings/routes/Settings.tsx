import { useState } from "react";
import { ApiKeyForm, ApiKeysList, type ProviderOption } from "../components";
import type { ApiKeyProvider } from "../api/types";
import { useApiKeys } from "../api/getApiKeys";
import { useSaveKey } from "../api/saveApiKey";
import { useDeleteKey } from "../api/deleteApiKey";

const providerOptions: ProviderOption[] = [
  { label: "OpenRouter", value: "openrouter" },
];

const providerLabels: Record<string, string> = providerOptions.reduce(
  (labels, option) => {
    labels[option.value] = option.label;
    return labels;
  },
  {} as Record<string, string>,
);

export function Settings() {
  const [apiKey, setApiKey] = useState<string>("");
  const [provider, setProvider] = useState<ApiKeyProvider>("openrouter");
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  const apiKeysQuery = useApiKeys();
  const saveKeyMutation = useSaveKey();
  const deleteKeyMutation = useDeleteKey();

  const handleSaveKey = () => {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      return;
    }

    saveKeyMutation.mutate(
      { provider, apiKey: trimmedKey },
      {
        onSuccess: () => {
          setApiKey("");
        },
      },
    );
  };

  const handleDeleteKey = (id: string) => {
    setDeletingKeyId(id);
    deleteKeyMutation.mutate(id, {
      onSettled: () => {
        setDeletingKeyId(null);
      },
    });
  };

  return (
    <div className="min-h-full px-6 py-6 text-slate-100">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-2 border-b border-slate-800 pb-5">
          <p className="text-sm font-semibold uppercase text-cyan-300">
            Settings
          </p>
          <h1 className="text-3xl font-semibold text-white">API keys</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Manage provider credentials for ModelPilot.
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.25fr)]">
          <ApiKeyForm
            apiKey={apiKey}
            isSaving={saveKeyMutation.isPending}
            provider={provider}
            providerOptions={providerOptions}
            onApiKeyChange={setApiKey}
            onProviderChange={setProvider}
            onSubmit={handleSaveKey}
          />

          <ApiKeysList
            apiKeys={apiKeysQuery.data ?? []}
            deletingKeyId={deletingKeyId}
            isLoading={apiKeysQuery.isLoading}
            providerLabels={providerLabels}
            onDelete={handleDeleteKey}
          />
        </div>
      </div>
    </div>
  );
}
