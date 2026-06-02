import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { signOut } from "firebase/auth";
import {
  GearSixIcon,
  SignOutIcon,
  RobotIcon,
  ChartBarIcon,
} from "@phosphor-icons/react";
import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";
import { ChatSidebarHistory } from "./ChatSidebarHistory";

const DRAWER_WIDTH = 256;

const navItems = [
  { to: "/analytics", label: "Analytics", icon: ChartBarIcon },
  { to: "/settings", label: "Settings", icon: GearSixIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const clearUser = useAppStore((s) => s.clearUser);

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  const handleLogout = async () => {
    await signOut(auth);
    clearUser();
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          px: 1.5,
          py: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1, pb: 2 }}>
        <RobotIcon size={24} color="#818cf8" weight="duotone" />
        <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600 }}>
          ModelPilot
        </Typography>
      </Box>

      <ChatSidebarHistory />

      <Divider sx={{ my: 1.5 }} />

      <List dense disablePadding>
        {navItems.map(({ to, label, icon: Icon }) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            sx={{
              mb: 0.5,
              "&.active": {
                bgcolor: "action.selected",
                color: "text.primary",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
              <Icon size={18} />
            </ListItemIcon>
            <ListItemText
              primary={label}
              slotProps={{ primary: { variant: "body2" } }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1, py: 1 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 12,
              bgcolor: "secondary.dark",
              color: "secondary.light",
            }}
          >
            {userInitial}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" noWrap sx={{ fontWeight: 500, display: "block" }}>
              {user?.name ?? "User"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block" }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "error.light", bgcolor: "error.dark", opacity: 0.12 },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
            <SignOutIcon size={18} />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            slotProps={{ primary: { variant: "body2" } }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
