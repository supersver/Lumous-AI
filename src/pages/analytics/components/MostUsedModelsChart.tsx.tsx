import { Card, Skeleton, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

import { useAnalyticsModels } from "../api/getAnalyticsModels";

// "openai/gpt-4o-mini:free" → "gpt-4o-mini"
const formatModelLabel = (model: string) =>
  model.split("/").pop()?.replace(/:.*$/, "") ?? model;

export function MostUsedModelsChart() {
  const { data, isLoading } = useAnalyticsModels({ limit: 10, offset: 0 });

  const models = data ?? [];

  // Transform data into the format expected by MUI PieChart
  const pieData = models.map((m, index) => ({
    id: index,
    value: m.requests,
    label: `${formatModelLabel(m.model)} (${m.requests} requests)`,
  }));

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
        <PieChart
          height={240}
          series={[
            {
              data: pieData,
              innerRadius: 30,
              paddingAngle: 2,
              cornerRadius: 4,
              // arcLabel: (item) => `${item.value} requests`,
              arcLabelMinAngle: 15,
            },
          ]}
          margin={{ right: 120 }}
        />
      )}
    </Card>
  );
}
