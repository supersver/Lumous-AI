import { useEffect, useMemo, useRef, useState } from "react";
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
import { CaretDown, Check, MagnifyingGlass } from "@phosphor-icons/react";

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

// inputPrice/outputPrice are USD per single token — scale to a per-1M-token rate for display
const formatPricePerMillion = (pricePerToken: number) => {
  const perMillion = pricePerToken * 1_000_000;
  return `$${perMillion % 1 === 0 ? perMillion.toFixed(0) : perMillion.toFixed(2)}`;
};

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

const tagChipSx = {
  bgcolor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.6)",
  fontSize: "0.6875rem",
  height: 22,
};

const priceChipSx = {
  bgcolor: "rgba(52, 211, 153, 0.1)",
  border: "1px solid rgba(52, 211, 153, 0.25)",
  color: "#34d399",
  fontSize: "0.6875rem",
  height: 22,
  fontWeight: 600,
};

const freeChipSx = {
  bgcolor: "rgba(52, 211, 153, 0.1)",
  border: "1px solid rgba(52, 211, 153, 0.25)",
  color: "#34d399",
  fontSize: "0.6875rem",
  height: 22,
  fontWeight: 600,
};

const reasoningChipSx = {
  bgcolor: "rgba(129, 140, 248, 0.12)",
  border: "1px solid rgba(129, 140, 248, 0.3)",
  color: "#818cf8",
  fontSize: "0.6875rem",
  height: 22,
  fontWeight: 600,
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
  const selectedItemRef = useRef<HTMLDivElement | null>(null);

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

  // The model currently highlighted inside the modal (drives the details panel)
  const detailModel = useMemo(
    () => models.find((m) => m.id === tempSelectedModelId) ?? null,
    [models, tempSelectedModelId],
  );

  const handleOpen = () => {
    const currentModel = selectedModel
      ? (models.find((m) => m.id === selectedModel.id) ?? null)
      : null;

    setTempSelectedModelId(selectedModel?.id ?? null);
    setModelSearch("");
    setActivePricing(
      currentModel ? (currentModel.isFree ? "free" : "paid") : null,
    );
    setActiveProvider(
      currentModel
        ? (providerOptions.find((p) => p.slug === currentModel.providerSlug) ??
            ALL_PROVIDERS)
        : ALL_PROVIDERS,
    );
    setIsModalOpen(true);
  };

  // Scroll the currently-selected row into view once the modal (and its filters) have rendered
  useEffect(() => {
    if (!isModalOpen) return;
    const frame = requestAnimationFrame(() => {
      selectedItemRef.current?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [isModalOpen]);

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

  const filtersAndList = (
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
              const isCurrentlyApplied = selectedModel?.id === model.id;
              return (
                <ListItemButton
                  key={model.id}
                  ref={isCurrentlyApplied ? selectedItemRef : undefined}
                  onClick={() => setTempSelectedModelId(model.id)}
                  sx={{
                    borderRadius: 1,
                    my: 0.5,
                    gap: 1,
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
                  {isCurrentlyApplied && (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ alignItems: "center", flexShrink: 0 }}
                    >
                      <Check size={14} weight="bold" color="#34d399" />
                      <Typography
                        variant="caption"
                        sx={{ color: "#34d399", fontWeight: 600 }}
                      >
                        Current
                      </Typography>
                    </Stack>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );

  const detailsPanel = (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        pl: 3,
        ml: 1,
        mt: 1,
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {detailModel ? (
        <Stack spacing={1.5}>
          {/* Name + price + reasoning, all on one line */}
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 0.75 }}
          >
            <Typography
              sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#fff" }}
            >
              {detailModel.name}
            </Typography>
            {detailModel.isFree ? (
              <Chip label="Free" size="small" sx={freeChipSx} />
            ) : (
              <Chip
                label={`${formatPricePerMillion(detailModel.inputPrice)}↑ / ${formatPricePerMillion(detailModel.outputPrice)}↓ per 1M`}
                size="small"
                sx={priceChipSx}
              />
            )}
            {detailModel.supportsReasoning && (
              <Chip label="Reasoning" size="small" sx={reasoningChipSx} />
            )}
            {selectedModel?.id === detailModel.id && (
              <Chip
                icon={<Check size={12} weight="bold" />}
                label="Selected"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.6875rem",
                  height: 22,
                  fontWeight: 600,
                  "& .MuiChip-icon": { color: "#34d399", ml: "6px" },
                }}
              />
            )}
          </Stack>

          {/* Provider */}
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
            <Box
              component="img"
              src={detailModel.providerLogo}
              alt=""
              sx={{ width: 14, height: 14, borderRadius: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.5)" }}
            >
              {detailModel.provider}
            </Typography>
          </Stack>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.6,
              fontSize: "0.8125rem",
            }}
          >
            {detailModel.description}
          </Typography>

          {/* Other details: context length + capability badges */}
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
            <Chip
              label={`${formatContextLength(detailModel.contextLength)} ctx`}
              size="small"
              sx={tagChipSx}
            />
            {detailModel.supportsVision && (
              <Chip label="Vision" size="small" sx={tagChipSx} />
            )}
            {detailModel.supportsTools && (
              <Chip label="Tools" size="small" sx={tagChipSx} />
            )}
            {detailModel.supportsStreaming && (
              <Chip label="Streaming" size="small" sx={tagChipSx} />
            )}
          </Stack>
        </Stack>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              fontSize: "0.8125rem",
            }}
          >
            Select a model to see details
          </Typography>
        </Box>
      )}
    </Box>
  );

  const modalContent = (
    <Stack direction="row" sx={{ alignItems: "flex-start" }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>{filtersAndList}</Box>
      {detailsPanel}
    </Stack>
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
