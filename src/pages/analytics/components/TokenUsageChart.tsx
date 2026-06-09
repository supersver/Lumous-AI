import { BarChart } from "@mui/x-charts/BarChart";
import type { AnalyticsDateRangeParams } from "../types/apiTypes";
import { useAnalyticsUsageByDay } from "../api/getUsageByDay";
import { Card, Skeleton, Typography } from "@mui/material";

interface TokenUsageChartProps {
  dateRange: AnalyticsDateRangeParams;
}

export function TokenUsageChart({ dateRange }: TokenUsageChartProps) {
  const { data, isLoading } = useAnalyticsUsageByDay(dateRange);

  const dates =
    data?.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    ) ?? [];
  const tokens = data?.map((d) => d.tokens) ?? [];

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Token Usage Over Time
      </Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
      ) : (
        <BarChart
          height={240}
          series={[{ data: tokens, label: "Tokens", color: "#00D3C3" }]}
          xAxis={[{ scaleType: "band", data: dates }]}
          sx={{ "& .MuiChartsAxis-tickLabel": { fontSize: 11 } }}
          borderRadius={4}
        />
      )}
    </Card>
  );
}
