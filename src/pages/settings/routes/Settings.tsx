import { useState } from "react";

import { Modal } from "@/components/elements/Modal";
import { useApiKeys } from "../api/getApiKeys";
import { useDeleteKey } from "../api/deleteApiKey";
import { useSaveKey } from "../api/saveApiKey";
import type { ApiKeyProvider } from "../api/types";
import { ApiKeyForm, ApiKeysList, type ProviderOption } from "../components";
import { Box, Container, Divider, Link, Typography } from "@mui/material";

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
  const [pendingDeleteKeyId, setPendingDeleteKeyId] = useState<string | null>(
    null,
  );
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
    setPendingDeleteKeyId(id);
  };

  const handleConfirmDeleteKey = () => {
    if (!pendingDeleteKeyId) {
      return;
    }

    const id = pendingDeleteKeyId;
    setPendingDeleteKeyId(null);
    setDeletingKeyId(id);
    deleteKeyMutation.mutate(id, {
      onSettled: () => {
        setDeletingKeyId(null);
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        py: 3,
        px: { xs: 2, sm: 3 },
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Box sx={{ pb: 2.5 }}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", fontWeight: 600, letterSpacing: 1 }}
          >
            Settings
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mt: 0.5, fontWeight: 600 }}
          >
            API keys
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: 560 }}
          >
            Manage provider credentials for ModelPilot.{" "}
            <Link
              href="https://openrouter.ai/workspaces/default/keys"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ fontSize: "inherit" }}
            >
              Get your OpenRouter key →
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              lg: "minmax(280px, 0.75fr) minmax(0, 1.25fr)",
            },
          }}
        >
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
        </Box>
      </Container>

      <Modal
        isOpen={Boolean(pendingDeleteKeyId)}
        onClose={() => setPendingDeleteKeyId(null)}
        onConfirm={handleConfirmDeleteKey}
        title="Delete API Key"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </Box>
  );
}
