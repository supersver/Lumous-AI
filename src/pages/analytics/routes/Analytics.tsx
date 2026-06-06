import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { OverviewCards } from "../components/OverviewCards";
import { CostOverTimeChart } from "../components/CostOverTimeChart.tsx";
import { TokenUsageChart } from "../components/TokenUsageChart.tsx";
import { MostUsedModelsChart } from "../components/MostUsedModelsChart.tsx.tsx";
import {
  useAnalyticsDateRange,
  type DateRangePreset,
} from "../hooks/useAnalyticsDateRange.ts";

const PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

export function Analytics() {
  const { dateRange, activePreset, applyPreset } = useAnalyticsDateRange();

  return (
    <Stack
      sx={{
        p: 3,
        gap: 3,
        // maxWidth: ,
        mx: "auto",
        width: "100%",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
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
          <TokenUsageChart dateRange={dateRange} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MostUsedModelsChart />
        </Grid>
      </Grid>
    </Stack>
  );
}
