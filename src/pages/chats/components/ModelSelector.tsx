import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { CaretDown } from "@phosphor-icons/react";

import type { SelectedModel } from "@/store/useAppStore";
import type { Model } from "../api/getModels";
import { Modal } from "@/components/elements/Modal";

export interface FilterProvider {
  name: string;
  slug: string;
  logo: string;
  count: number;
}

export interface FilterPricing {
  free: number;
  paid: number;
}

export interface ModelsFilters {
  providers: FilterProvider[];
  pricing: FilterPricing;
}

interface ModelSelectorProps {
  isError: boolean;
  isLoading: boolean;
  models: Model[];
  filters?: ModelsFilters;
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
  filters,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  // Modal & Selection State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempSelectedModelId, setTempSelectedModelId] = useState<string | null>(
    selectedModel?.id ?? null,
  );
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [activePricing, setActivePricing] = useState<"free" | "paid" | null>(
    null,
  );

  // Filter the models list based on the active chips
  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      let matches = true;

      if (activeProvider && model.providerSlug !== activeProvider) {
        matches = false;
      }
      if (activePricing === "free" && !model.isFree) {
        matches = false;
      }
      if (activePricing === "paid" && !model.isPaid) {
        matches = false;
      }

      return matches;
    });
  }, [models, activeProvider, activePricing]);

  // Handlers
  const handleOpen = () => {
    setTempSelectedModelId(selectedModel?.id ?? null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    const modelToSelect = models.find((m) => m.id === tempSelectedModelId);
    onModelChange(
      modelToSelect ? { id: modelToSelect.id, name: modelToSelect.name } : null,
    );
    setIsModalOpen(false);
  };

  const activeModel = useMemo(() => {
    return models.find((model) => model.id === selectedModel?.id) ?? null;
  }, [models, selectedModel?.id]);

  const emptyLabel = isLoading
    ? "Loading models..."
    : isError
      ? "Models unavailable"
      : "Select model...";

  const modalContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
      {filters && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Providers Filter */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Providers
            </Typography>
            <Stack direction="row" sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="All"
                onClick={() => setActiveProvider(null)}
                sx={{
                  bgcolor:
                    activeProvider === null
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color:
                    activeProvider === null ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              />
              {filters.providers.map((provider) => (
                <Chip
                  key={provider.slug}
                  label={`${provider.name} (${provider.count})`}
                  onClick={() => setActiveProvider(provider.slug)}
                  sx={{
                    bgcolor:
                      activeProvider === provider.slug
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color:
                      activeProvider === provider.slug
                        ? "#fff"
                        : "rgba(255,255,255,0.6)",
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Pricing Filter */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Pricing
            </Typography>
            <Stack direction="row" sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="All"
                onClick={() => setActivePricing(null)}
                sx={{
                  bgcolor:
                    activePricing === null
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color:
                    activePricing === null ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              />
              <Chip
                label={`Free (${filters.pricing.free})`}
                onClick={() => setActivePricing("free")}
                sx={{
                  bgcolor:
                    activePricing === "free"
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color:
                    activePricing === "free" ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              />
              <Chip
                label={`Paid (${filters.pricing.paid})`}
                onClick={() => setActivePricing("paid")}
                sx={{
                  bgcolor:
                    activePricing === "paid"
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color:
                    activePricing === "paid" ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              />
            </Stack>
          </Box>
        </Box>
      )}

      {/* Model List */}
      <Box
        sx={{
          maxHeight: 250,
          overflowY: "auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          mx: -3,
          px: 2,
        }}
      >
        {filteredModels.length === 0 ? (
          <Typography
            sx={{
              p: 2,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            No models match your selected filters.
          </Typography>
        ) : (
          <List disablePadding>
            {filteredModels.map((model) => {
              const isSelected = tempSelectedModelId === model.id;
              return (
                <ListItemButton
                  key={model.id}
                  onClick={() => setTempSelectedModelId(model.id)}
                  sx={{
                    borderRadius: "8px",
                    my: 0.5,
                    bgcolor: isSelected
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: isSelected
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.04)",
                    },
                  }}
                >
                  <ListItemText
                    primary={model.name}
                    secondary={`${formatContextLength(model.contextLength)} tokens`}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.875rem",
                          fontWeight: isSelected ? 600 : 400,
                          color: isSelected ? "#fff" : "rgba(255,255,255,0.8)",
                        },
                      },
                      secondary: {
                        sx: {
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.4)",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={isLoading || models.length === 0}
        endIcon={<CaretDown weight="bold" size={14} />}
        disableElevation
        sx={{
          // Professional pill-shape styling
          borderRadius: "20px",
          textTransform: "none",
          bgcolor: isError ? "rgba(244, 67, 54, 0.08)" : "transparent",
          border: "1px solid",
          borderColor: isError ? "error.main" : "transparent",
          color: isError
            ? "error.main"
            : activeModel
              ? "#fff"
              : "rgba(255,255,255,0.5)",
          px: 1.5,
          py: 0.5,
          minHeight: "32px",
          fontSize: "0.875rem",
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.08)",
            borderColor: isError ? "error.dark" : "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        {activeModel ? activeModel.name : emptyLabel}
      </Button>

      {/* The Reusable Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Select AI Model"
        description={modalContent}
        confirmLabel="Apply"
        cancelLabel="Cancel"
      />
    </>
  );
}
