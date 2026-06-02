import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { KeyIcon, TrashIcon } from "@phosphor-icons/react";

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
    <Stack spacing={1.5}>
      {[0, 1, 2].map((item) => (
        <Skeleton
          key={item}
          variant="rounded"
          height={74}
          sx={{ bgcolor: "background.default" }}
        />
      ))}
    </Stack>
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
    <Paper
      component="section"
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Existing keys
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {apiKeys.length} saved
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: "secondary.dark",
            color: "secondary.light",
            opacity: 0.9,
          }}
        >
          <KeyIcon size={20} weight="duotone" />
        </Box>
      </Stack>

      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <LoadingKeys />
        ) : apiKeys.length === 0 ? (
          <Alert severity="info" variant="outlined">
            No API keys saved yet.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            {apiKeys.map((apiKey) => {
              const createdAt = formatDate(apiKey.createdAt);
              const isDeleting = deletingKeyId === apiKey.id;

              return (
                <Paper
                  key={apiKey.id}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor: "background.default",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", flexWrap: "wrap" }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {providerLabels[apiKey.provider] ?? apiKey.provider}
                      </Typography>
                      {apiKey.name ? (
                        <Typography variant="caption" color="text.secondary">
                          {apiKey.name}
                        </Typography>
                      ) : null}
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ fontFamily: "monospace", mt: 0.5 }}
                    >
                      {getKeyPreview(apiKey)}
                    </Typography>
                    {createdAt ? (
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
                        Added {createdAt}
                      </Typography>
                    ) : null}
                  </Box>

                  <IconButton
                    size="small"
                    disabled={isDeleting}
                    aria-label={`Delete ${
                      providerLabels[apiKey.provider] ?? apiKey.provider
                    } API key`}
                    onClick={() => onDelete(apiKey.id)}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      "&:hover": {
                        borderColor: "error.main",
                        color: "error.main",
                      },
                    }}
                  >
                    {isDeleting ? (
                      <CircularProgress size={18} />
                    ) : (
                      <TrashIcon size={18} />
                    )}
                  </IconButton>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
