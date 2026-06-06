import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  EyeIcon,
  EyeSlashIcon,
  FloppyDiskIcon,
  KeyIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { type FormEvent, useState, useCallback } from "react";

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

// Basic sanity check — non-empty, min length, no whitespace
const validateKey = (key: string): string | null => {
  if (!key.trim()) return null;
  if (key !== key.trim())
    return "Key must not contain leading or trailing spaces.";
  if (key.length < 20) return "Key seems too short.";
  return null;
};

export function ApiKeyForm({
  apiKey,
  isSaving,
  provider,
  providerOptions,
  onApiKeyChange,
  onProviderChange,
  onSubmit,
}: ApiKeyFormProps) {
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  const validationError = touched ? validateKey(apiKey) : null;
  const isValid = apiKey.trim().length >= 20 && apiKey === apiKey.trim();
  const canSubmit = !isSaving && isValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (canSubmit) onSubmit();
  };

  // Strip whitespace on paste — a common source of invalid keys
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pasted = event.clipboardData.getData("text").trim();
      onApiKeyChange(pasted);
      setTouched(true);
    },
    [onApiKeyChange],
  );

  const handleChange = (value: string) => {
    onApiKeyChange(value);
    if (!touched) setTouched(true);
  };

  // Mask all but last 4 chars for the visible preview
  const maskedPreview =
    apiKey.length > 4
      ? `${"•".repeat(Math.min(apiKey.length - 4, 24))}${apiKey.slice(-4)}`
      : "";

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
      {/* Header */}
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

          <Box>
            <TextField
              fullWidth
              size="small"
              type={visible ? "text" : "password"}
              label="API key"
              value={apiKey}
              disabled={isSaving}
              error={Boolean(validationError)}
              helperText={validationError ?? " "}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={() => setTouched(true)}
              onPaste={handlePaste}
              placeholder="sk-or-v1-..."
              autoComplete="new-api-key" // Prevents browser autofill
              spellCheck={false}
              slotProps={{
                htmlInput: {
                  "data-lpignore": "true",
                  "data-1p-ignore": "true",
                  "data-bwignore": "true",
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Validity indicator */}
                      {apiKey && (
                        <Tooltip
                          title={
                            isValid
                              ? "Key format looks valid"
                              : "Key format invalid"
                          }
                          placement="top"
                        >
                          <ShieldCheckIcon
                            size={16}
                            weight="duotone"
                            color={isValid ? "#34d399" : "#f87171"}
                            style={{ marginRight: 4 }}
                          />
                        </Tooltip>
                      )}
                      <Tooltip
                        title={visible ? "Hide key" : "Reveal key"}
                        placement="top"
                      >
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() => setVisible((v) => !v)}
                          tabIndex={-1}
                          aria-label={visible ? "Hide API key" : "Show API key"}
                        >
                          {visible ? (
                            <EyeSlashIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Masked key preview — only visible when field is hidden */}
            {!visible && maskedPreview && (
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{
                  mt: 0.5,
                  ml: 0.25,
                  display: "block",
                  fontFamily: "monospace",
                }}
              >
                {maskedPreview}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!canSubmit}
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
