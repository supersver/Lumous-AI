import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { GlobeHemisphereWest } from "@phosphor-icons/react";

import type { ChatSettings } from "../types";
import { ReasoningToggle } from "./ReasoningToggle";

interface ChatControlsProps {
  disabled?: boolean;
  settings: ChatSettings;
  onSettingsChange: (patch: Partial<ChatSettings>) => void;
}

export function ChatControls({
  disabled = false,
  settings,
  onSettingsChange,
}: ChatControlsProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <Button
        type="button"
        disabled={disabled}
        aria-pressed={settings.webSearch}
        startIcon={
          <GlobeHemisphereWest
            size={15}
            weight={settings.webSearch ? "fill" : "regular"}
          />
        }
        onClick={() => onSettingsChange({ webSearch: !settings.webSearch })}
        sx={{
          borderRadius: "20px",
          minHeight: 32,
          px: 1.25,
          py: 0.5,
          border: "1px solid",
          borderColor: settings.webSearch ? "primary.light" : "divider",
          bgcolor: settings.webSearch
            ? "rgba(129, 140, 248, 0.14)"
            : "transparent",
          color: settings.webSearch ? "primary.light" : "text.secondary",
          fontSize: "0.8125rem",
          fontWeight: 600,
          textTransform: "none",
          whiteSpace: "nowrap",
          "&:hover": {
            borderColor: settings.webSearch ? "primary.light" : "text.secondary",
            bgcolor: settings.webSearch
              ? "rgba(129, 140, 248, 0.2)"
              : "rgba(255,255,255,0.06)",
          },
        }}
      >
        Web Search
      </Button>

      <ReasoningToggle
        checked={settings.reasoning}
        disabled={disabled}
        onChange={(reasoning) => onSettingsChange({ reasoning })}
      />
    </Box>
  );
}
