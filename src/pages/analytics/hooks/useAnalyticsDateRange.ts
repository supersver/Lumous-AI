import { useState } from "react";
import type { AnalyticsDateRangeParams } from "../types/apiTypes";

export type DateRangePreset = "7d" | "30d" | "90d";

const PRESET_DAYS: Record<DateRangePreset, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const buildRange = (days: number): AnalyticsDateRangeParams => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
};

export function useAnalyticsDateRange() {
  const [activePreset, setActivePreset] = useState<DateRangePreset>("30d");
  const [dateRange, setDateRange] = useState<AnalyticsDateRangeParams>(() =>
    buildRange(30),
  );

  const applyPreset = (preset: DateRangePreset) => {
    setActivePreset(preset);
    setDateRange(buildRange(PRESET_DAYS[preset]));
  };

  return { dateRange, activePreset, applyPreset };
}
