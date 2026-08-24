import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { OverviewCards } from "../components/OverviewCards";
import { CostOverTimeChart } from "../components/CostOverTimeChart.tsx";
import { TokenUsageChart } from "../components/TokenUsageChart.tsx";
import { MostUsedModelsChart } from "../components/MostUsedModelsChart.tsx.tsx";
import {
  useAnalyticsDateRange,
  type DateRangePreset,
} from "../hooks/useAnalyticsDateRange.ts";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CaretLeftIcon } from "@phosphor-icons/react";

const PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

export function Analytics() {
  const { dateRange, activePreset, applyPreset } = useAnalyticsDateRange();
  const navigate = useNavigate();

  return (
    <Stack
      sx={{
        p: 3,
        gap: 3,
        mx: "auto",
        width: "100%",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <IconButton
            size="small"
            aria-label="Back to home"
            onClick={() => {
              navigate("/");
            }}
            sx={{
              fontSize: 14,
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            <CaretLeftIcon />
            Back
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Analytics
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Track usage, cost, and model performance
          </Typography>
        </Box>

        <ButtonGroup size="small">
          {PRESETS.map(({ label, value }) => (
            <Button
              key={value}
              onClick={() => applyPreset(value)}
              variant={activePreset === value ? "contained" : "outlined"}
              disableElevation
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Stat cards */}
      <OverviewCards dateRange={dateRange} />

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CostOverTimeChart dateRange={dateRange} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MostUsedModelsChart />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TokenUsageChart dateRange={dateRange} />
        </Grid>
      </Grid>
    </Stack>
  );
}
