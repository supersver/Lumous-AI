import { Card, Skeleton, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import { useAnalyticsModels } from "../api/getAnalyticsModels";

// "openai/gpt-4o-mini:free" → "gpt-4o-mini"
const formatModelLabel = (model: string) =>
  model.split("/").pop()?.replace(/:.*$/, "") ?? model;

export function MostUsedModelsChart() {
  const { data, isLoading } = useAnalyticsModels({ limit: 6, offset: 0 });

  const models = data ?? [];
  const labels = models.map((m) => formatModelLabel(m.model));
  const requests = models.map((m) => m.requests);

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Most Used Models
      </Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
      ) : models?.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No model data yet.
        </Typography>
      ) : (
        <BarChart
          height={240}
          layout="horizontal"
          series={[{ data: requests, label: "Requests", color: "#6366f1" }]}
          yAxis={[{ scaleType: "band", data: labels }]}
          xAxis={[{ label: "Requests" }]}
          sx={{ "& .MuiChartsAxis-tickLabel": { fontSize: 11 } }}
          borderRadius={4}
        />
      )}
    </Card>
  );
}
