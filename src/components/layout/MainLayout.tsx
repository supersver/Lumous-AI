import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

import { ChatSessionsProvider } from "@/pages/chats/context/ChatSessionsContext";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/useAppStore";

export function MainLayout() {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);

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
          <Outlet />
        </Box>
      </Box>
    </ChatSessionsProvider>
  );
}
