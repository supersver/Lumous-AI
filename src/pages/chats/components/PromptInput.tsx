import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { ArrowUpRightIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, type KeyboardEvent } from "react";
import { useShallow } from "zustand/react/shallow";

import { ModelSelector } from "./ModelSelector";
import { useGetModels } from "../api/getModels";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";

interface PromptInputProps {
  canSend: boolean;
  draft: string;
  isSending?: boolean;
  selectedModelName?: string;
  onDraftChange: (draft: string) => void;
  onSend: () => void;
}

export function PromptInput({
  canSend,
  draft,
  isSending = false,
  selectedModelName,
  onDraftChange,
  onSend,
}: PromptInputProps) {
  const modelsQuery = useGetModels();
  const navigate = useNavigate();

  const { selectedModel, setSelectedModel } = useAppStore(
    useShallow((state) => ({
      selectedModel: state.selectedModel,
      setSelectedModel: state.setSelectedModel,
    })),
  );

  // Extract models and filters from the updated API response shape
  const models = useMemo(
    () => modelsQuery.data?.models ?? [],
    [modelsQuery.data?.models],
  );
  const filters = modelsQuery.data?.filters;

  useEffect(() => {
    if (models.length === 0) return;

    const selectedModelExists = models.some(
      (model) => model.id === selectedModel?.id,
    );

    if (!selectedModelExists) {
      const firstModel = models[0];
      setSelectedModel({ id: firstModel.id, name: firstModel.name });
    }
  }, [models, selectedModel?.id, setSelectedModel]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) {
        onSend();
      }
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.default",
        px: { xs: 2, sm: 3 },
        py: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "3px",
      }}
    >
      {!selectedModel && (
        <Button
          onClick={() => navigate("/settings")}
          sx={{ fontWeight: 600, fontSize: 14, color: "yellow" }}
        >
          To Start, provide API Key in Settings <ArrowUpRightIcon />
        </Button>
      )}
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 896,
          bgcolor: "background.paper",
          borderRadius: "24px",
          border: "1px solid",
          borderColor: "divider",
          p: 1.5,
          boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.04)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:focus-within": {
            borderColor: "primary.main",
          },
        }}
      >
        <InputBase
          fullWidth
          multiline
          minRows={1}
          maxRows={6}
          disabled={isSending}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedModelName
              ? `Message ${selectedModelName}...`
              : "Select a model to chat"
          }
          sx={{
            px: 1,
            pb: 2,
            fontSize: "1rem",
            alignItems: "flex-start",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
          }}
        >
          {/* Left Side: Model Selector */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {modelsQuery.isLoading ? (
              <Box sx={{ px: 2, py: 1 }}>
                <CircularProgress size={16} />
              </Box>
            ) : (
              <ModelSelector
                isError={modelsQuery.isError}
                isLoading={modelsQuery.isLoading}
                models={models}
                filters={filters}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            )}
          </Box>

          {/* Right Side: Send Button */}
          <IconButton
            type="submit"
            disabled={!canSend || models.length === 0}
            aria-label="Send prompt"
            sx={{
              width: 40,
              height: 40,
              bgcolor: canSend ? "text.primary" : "action.disabledBackground",
              color: canSend ? "background.default" : "text.disabled",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: canSend ? "text.primary" : undefined,
                opacity: 0.8,
              },
            }}
          >
            <PaperPlaneTiltIcon size={18} weight="fill" />
          </IconButton>
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{ fontWeight: 600, fontSize: 14, color: "GrayText" }}
      >
        Lumous is AI and can make mistakes.
      </Typography>
    </Box>
  );
}
