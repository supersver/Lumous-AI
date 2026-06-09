import {
  ChatsCircleIcon,
  CoinIcon,
  CpuIcon,
  TimerIcon,
} from "@phosphor-icons/react";
import type { ElementType } from "react";

import { useAnalyticsOverview } from "../api/getAnalyticsOverview";
import type { AnalyticsDateRangeParams } from "../types/apiTypes";
import { Box, Card, Grid, Skeleton, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ElementType;
  color: string;
  bg: string;
  isLoading: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  isLoading,
}: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={color} weight="duotone" />
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.25 }}
        >
          {label}
        </Typography>
        {isLoading ? (
          <Skeleton width={90} height={28} />
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {value}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

interface OverviewCardsProps {
  dateRange: AnalyticsDateRangeParams;
}

export function OverviewCards({ dateRange }: OverviewCardsProps) {
  const { data, isLoading } = useAnalyticsOverview(dateRange);

  const cards = [
    {
      label: "Total Spend",
      value: data?.totalCost != null ? `$${data?.totalCost}` : "—",
      icon: CoinIcon,
      color: "#818cf8",
      bg: "rgba(129,140,248,0.1)",
    },
    {
      label: "Total Tokens",
      value:
        data?.totalTokens != null ? data.totalTokens.toLocaleString() : "—",
      icon: CpuIcon,
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
    },
    {
      label: "Total Chats",
      value:
        data?.totalMessages != null ? data.totalMessages.toLocaleString() : "—",
      icon: ChatsCircleIcon,
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.1)",
    },
    {
      label: "Avg Latency",
      value:
        data?.averageLatency != null
          ? `${data.averageLatency?.toFixed(2)}ms`
          : "—",
      icon: TimerIcon,
      color: "#fb923c",
      bg: "rgba(251,146,60,0.1)",
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...card} isLoading={isLoading} />
        </Grid>
      ))}
    </Grid>
  );
}
