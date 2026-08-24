import { Box, Typography } from "@mui/material";
import logo from "@/assets/logo.svg";

interface LogoWithNameProps {
  height?: number;
  fontSize?: string;
  hideOnDesktop?: boolean;
}

export default function LogoWithName({
  height = 40,
  fontSize = "1rem",
  hideOnDesktop = false,
}: LogoWithNameProps) {
  return (
    <Box
      sx={{
        display: hideOnDesktop ? { xs: "flex", lg: "none" } : "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <img
        src={logo}
        alt="Lumous AI"
        style={{
          width: "auto",
          height,
          display: "block",
        }}
      />

      <Typography
        component="span"
        sx={{
          fontSize,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "text.primary",
        }}
      >
        Lumous AI
      </Typography>
    </Box>
  );
}
