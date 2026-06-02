import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FloppyDiskIcon, KeyIcon } from "@phosphor-icons/react";
import type { FormEvent } from "react";

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
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: "primary.dark",
            color: "primary.main",
            opacity: 0.9,
          }}
        >
          <KeyIcon size={20} weight="duotone" />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Add API key
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Provider credentials
          </Typography>
        </Box>
      </Stack>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2.5}>
          <ProviderSelect
            value={provider}
            options={providerOptions}
            disabled={isSaving}
            onChange={onProviderChange}
          />

          <TextField
            fullWidth
            size="small"
            type="password"
            label="API key"
            value={apiKey}
            disabled={isSaving}
            onChange={(event) => onApiKeyChange(event.target.value)}
            placeholder="sk-or-v1-..."
            autoComplete="off"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSaving || !apiKey.trim()}
            startIcon={
              isSaving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <FloppyDiskIcon size={18} weight="bold" />
              )
            }
          >
            {isSaving ? "Saving..." : "Save key"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
