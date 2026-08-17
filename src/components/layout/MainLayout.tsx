import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Outlet />
    </Box>
  );
}
