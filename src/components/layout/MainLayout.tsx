import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <NavBar />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          px: 3.5,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
