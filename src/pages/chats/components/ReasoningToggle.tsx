import Button from "@mui/material/Button";
import { Sparkle } from "@phosphor-icons/react";

interface ReasoningToggleProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function ReasoningToggle({
  checked,
  disabled = false,
  onChange,
}: ReasoningToggleProps) {
  return (
    <Button
      type="button"
      disabled={disabled}
      aria-pressed={checked}
      startIcon={<Sparkle size={15} weight={checked ? "fill" : "regular"} />}
      onClick={() => onChange(!checked)}
      sx={{
        borderRadius: "20px",
        minHeight: 32,
        px: 1.25,
        py: 0.5,
        border: "1px solid",
        borderColor: checked ? "secondary.light" : "divider",
        bgcolor: checked ? "rgba(34, 211, 238, 0.12)" : "transparent",
        color: checked ? "secondary.light" : "text.secondary",
        fontSize: "0.8125rem",
        fontWeight: 600,
        textTransform: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          borderColor: checked ? "secondary.light" : "text.secondary",
          bgcolor: checked
            ? "rgba(34, 211, 238, 0.18)"
            : "rgba(255,255,255,0.06)",
        },
      }}
    >
      Reasoning
    </Button>
  );
}
