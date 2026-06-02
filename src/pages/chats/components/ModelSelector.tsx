import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useMemo } from "react";

import type { SelectedModel } from "@/store/useAppStore";
import type { Model } from "../api/getModels";

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

  const emptyLabel = isLoading
    ? "Loading models..."
    : isError
      ? "Models unavailable"
      : "Select model";

  return (
    <FormControl
      size="small"
      disabled={isLoading || isError || models.length === 0}
      sx={{ minWidth: { xs: "100%", sm: 320 } }}
    >
      <InputLabel id="chat-model-label">Model</InputLabel>
      <Select
        labelId="chat-model-label"
        id="chat-model"
        label="Model"
        value={selectedModel?.id ?? ""}
        onChange={(event) => handleModelChange(event.target.value)}
      >
        <MenuItem value="">{emptyLabel}</MenuItem>
        {models.map((model) => (
          <MenuItem key={model.id} value={model.id}>
            {model.name} · {formatContextLength(model.contextLength)} context
          </MenuItem>
        ))}
      </Select>
      {activeModel ? (
        <FormHelperText>
          {formatContextLength(activeModel.contextLength)} tokens
        </FormHelperText>
      ) : null}
      {isError ? (
        <Alert severity="error" sx={{ mt: 1 }}>
          Could not load models.
        </Alert>
      ) : null}
    </FormControl>
  );
}
