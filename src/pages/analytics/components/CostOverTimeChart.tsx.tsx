import { LineChart } from "@mui/x-charts/LineChart";

import type { AnalyticsDateRangeParams } from "../types/apiTypes";
import { useAnalyticsUsageByDay } from "../api/getUsageByDay";
import { Box, Card, Skeleton, Typography } from "@mui/material";
import { ChartLineDownIcon } from "@phosphor-icons/react";

interface CostOverTimeChartProps {
  dateRange: AnalyticsDateRangeParams;
}

export function CostOverTimeChart({ dateRange }: CostOverTimeChartProps) {
  const { data, isLoading } = useAnalyticsUsageByDay(dateRange);

  const dates =
    data?.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    ) ?? [];
  const costs = data?.map((d) => d.cost) ?? [];

  const hasData = costs.some((c) => c > 0);

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
        Cost Over Time
      </Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
      ) : !hasData ? (
        <Box
          sx={{
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <ChartLineDownIcon size={62} />

          <Typography variant="body2" color="text.secondary">
            No cost data for this period.
          </Typography>
        </Box>
      ) : (
        <LineChart
          height={240}
          series={[
            {
              data: costs,
              label: "Cost ($)",
              color: "#818cf8",
              area: true,
              showMark: false,
            },
          ]}
          xAxis={[{ scaleType: "point", data: dates }]}
          sx={{
            "& .MuiAreaElement-root": { fillOpacity: 0.15 },
            "& .MuiChartsAxis-tickLabel": { fontSize: 11 },
          }}
        />
      )}
    </Card>
  );
}
