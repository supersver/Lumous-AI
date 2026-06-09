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
  TextField,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";

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

type ProviderOption = { label: string; slug: string | null };

const ALL_PROVIDERS: ProviderOption = { label: "All Providers", slug: null };

const numberFormatter = new Intl.NumberFormat();
const formatContextLength = (n: number) => numberFormatter.format(n);

// Shared dark input styles for TextField / Autocomplete
const darkInputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    bgcolor: "rgba(255,255,255,0.04)",
    color: "white",
    fontSize: "0.875rem",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.3)" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.35)",
    opacity: 1,
  },
  // Autocomplete clear + popup icons
  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.4)" },
};

export function ModelSelector({
  isError,
  isLoading,
  models,
  filters,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedModelId, setTempSelectedModelId] = useState<string | null>(
    selectedModel?.id ?? null,
  );
  const [activeProvider, setActiveProvider] =
    useState<ProviderOption>(ALL_PROVIDERS);
  const [activePricing, setActivePricing] = useState<"free" | "paid" | null>(
    null,
  );
  const [modelSearch, setModelSearch] = useState("");

  const providerOptions: ProviderOption[] = useMemo(
    () => [
      ALL_PROVIDERS,
      ...(filters?.providers.map((p) => ({
        label: `${p.name} (${p.count})`,
        slug: p.slug,
      })) ?? []),
    ],
    [filters],
  );

  const filteredModels = useMemo(() => {
    const search = modelSearch.toLowerCase();
    return models.filter((model) => {
      if (activeProvider.slug && model.providerSlug !== activeProvider.slug)
        return false;
      if (activePricing === "free" && !model.isFree) return false;
      if (activePricing === "paid" && !model.isPaid) return false;
      if (search && !model.name.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [models, activeProvider, activePricing, modelSearch]);

  const activeModel = useMemo(
    () => models.find((m) => m.id === selectedModel?.id) ?? null,
    [models, selectedModel?.id],
  );

  const handleOpen = () => {
    setTempSelectedModelId(selectedModel?.id ?? null);
    setModelSearch("");
    setIsModalOpen(true);
  };

  const handleClose = () => setIsModalOpen(false);

  const handleConfirm = () => {
    const model = models.find((m) => m.id === tempSelectedModelId);
    onModelChange(model ? { id: model.id, name: model.name } : null);
    setIsModalOpen(false);
  };

  const emptyLabel = isLoading
    ? "Loading models..."
    : isError
      ? "Models unavailable"
      : "Select model...";

  const sectionLabel = (text: string) => (
    <Typography
      variant="caption"
      sx={{
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontWeight: 600,
      }}
    >
      {text}
    </Typography>
  );

  const modalContent = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
      {/* Providers — searchable dropdown */}
      <Box>
        {sectionLabel("Provider")}
        <Autocomplete
          disableClearable
          size="small"
          options={providerOptions}
          value={activeProvider}
          onChange={(_, newValue) =>
            setActiveProvider(newValue ?? ALL_PROVIDERS)
          }
          isOptionEqualToValue={(opt, val) => opt.slug === val.slug}
          getOptionLabel={(opt) => opt.label}
          sx={{ mt: 1 }}
          slotProps={{
            paper: {
              sx: {
                bgcolor: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "white",
                "& .MuiAutocomplete-option": {
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.8)",
                  '&[aria-selected="true"]': {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                },
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search providers..."
              sx={darkInputSx}
            />
          )}
        />
      </Box>

      {/* Pricing filter */}
      <Box>
        {sectionLabel("Pricing")}
        <Stack direction="row" sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
          {(["all", "free", "paid"] as const).map((key) => {
            const isAll = key === "all";
            const isActive = isAll
              ? activePricing === null
              : activePricing === key;
            const label = isAll
              ? "All"
              : key === "free"
                ? `Free (${filters?.pricing.free ?? 0})`
                : `Paid (${filters?.pricing.paid ?? 0})`;
            return (
              <Chip
                key={key}
                label={label}
                onClick={() => setActivePricing(isAll ? null : key)}
                size="small"
                sx={{
                  bgcolor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Model search */}
      <TextField
        size="small"
        placeholder="Search models..."
        value={modelSearch}
        onChange={(e) => setModelSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlass size={15} color="rgba(255,255,255,0.35)" />
              </InputAdornment>
            ),
          },
        }}
        sx={darkInputSx}
      />

      {/* Model list */}
      <Box
        sx={{
          maxHeight: 240,
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
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            No models match your filters.
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
                    borderRadius: 1,
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
                          color: "rgba(255,255,255,0.35)",
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
