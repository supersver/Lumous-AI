import { Box, Paper, Typography, useTheme } from "@mui/material";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import type { ElementType } from "react";

export function ToolCard({
  title,
  description,
  icon: Icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: ElementType;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <Paper
      component="button"
      type="button"
      onClick={onClick}
      role="button"
      aria-label={`Open ${title}`}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 2.5,
        textAlign: "left",
        cursor: "pointer",
        color: "text.primary",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        transition: "border-color 0.2s ease, transform 0.2s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          transform: "translateY(-2px)",
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: 2.5,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          flexShrink: 0,
        }}
      >
        <Icon size={24} weight="fill" />
      </Box>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </Box>
      <ArrowUpRightIcon
        size={18}
        style={{ position: "absolute", top: 16, right: 16, opacity: 0.5 }}
      />
    </Paper>
  );
}
