import { Box, Button, Paper, Typography } from "@mui/material";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import type { ElementType } from "react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: ElementType;
  color: string;
  onClick: () => void;
}

export function ToolCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}: ToolCardProps) {
  return (
    <Paper
      component="button"
      type="button"
      onClick={onClick}
      aria-label={`Open ${title}`}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 1.5,
        p: 2.5,
        textAlign: "left",
        cursor: "pointer",
        color: "text.primary",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        transition:
          "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",

        "&:hover": {
          borderColor: color,
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${color}18`,
        },

        "&:focus-visible": {
          outline: `2px solid ${color}`,
          outlineOffset: 2,
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: 2.5,
          color,
          backgroundColor: `${color}12`,
          border: `1px solid ${color}25`,
          flexShrink: 0,
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        <Icon size={24} weight="duotone" />
      </Box>

      {/* Content */}
      <Box sx={{ pr: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* CTA */}
      <Button
        variant="outlined"
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        endIcon={<ArrowUpRightIcon size={15} />}
        sx={{
          alignSelf: "flex-start",
          mt: 1,
          px: 1.5,
          border: 0,
          color,
          textTransform: "none",
          borderRadius: 1.5,
          fontWeight: 600,
          transition: "background-color 0.2s ease, border-color 0.2s ease",

          "&:hover": {
            borderColor: color,
            backgroundColor: `${color}12`,
          },
        }}
      >
        Open Workspace
      </Button>
    </Paper>
  );
}
