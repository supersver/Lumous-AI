import { useTheme, useMediaQuery, Box, IconButton } from "@mui/material";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { Outlet } from "react-router-dom";

import { ChatSessionsProvider } from "@/pages/chats/context/ChatSessionsProvider";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/useAppStore";

export function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useAppStore((s) => s.setSidebarCollapsed);
  const mobileOpen = useAppStore((s) => s.mobileOpen);
  const setMobileOpen = useAppStore((s) => s.setMobileOpen);

  return (
    <ChatSessionsProvider>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <Box
          component="main"
          sx={{
            display: "flex",
            minHeight: 0,
            flex: 1,
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Mobile header strip — only rendered on mobile */}
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1,
                py: 0.5,
                flexShrink: 0,
                position: "relative",
              }}
            >
              <IconButton
                size="small"
                onClick={() => setMobileOpen(true)}
                sx={{
                  color: "text.secondary",
                  position: "absolute",
                  top: 4,
                  left: 5,
                  border: 0.5,
                  borderColor: "background.paper",
                  borderRadius: "100%",
                }}
              >
                <SidebarSimpleIcon size={20} />
              </IconButton>
            </Box>
          )}

          <Outlet />
        </Box>
      </Box>
    </ChatSessionsProvider>
  );
}
