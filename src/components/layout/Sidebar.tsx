import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { signOut } from "firebase/auth";
import { useState } from "react";
import {
  GearSixIcon,
  SignOutIcon,
  RobotIcon,
  ChartBarIcon,
  CaretUpDownIcon,
} from "@phosphor-icons/react";
import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { Modal } from "@/components/elements/Modal";
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
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
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
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1, pb: 2 }}
      >
        <RobotIcon size={24} color="#818cf8" weight="duotone" />
        <Typography
          variant="subtitle1"
          color="text.primary"
          sx={{ fontWeight: 600 }}
        >
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
              "&.active": { bgcolor: "action.selected", color: "text.primary" },
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

      {/* User dropdown trigger */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 1.5 }} />
        <ListItemButton
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{
            borderRadius: 2,
            gap: 1,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 12,
              bgcolor: "secondary.dark",
              color: "secondary.light",
              flexShrink: 0,
            }}
          >
            {userInitial}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              noWrap
              sx={{ fontWeight: 500, display: "block" }}
            >
              {user?.name ?? "User"}
            </Typography>
          </Box>
          <CaretUpDownIcon size={14} style={{ flexShrink: 0, opacity: 0.4 }} />
        </ListItemButton>
      </Box>

      {/* Dropdown menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              width: DRAWER_WIDTH - 24,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              mb: 0.5,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, display: "block" }}
          >
            {user?.name ?? "User"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            {user?.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setIsLogoutModalOpen(true);
          }}
          sx={{
            gap: 1.5,
            mt: 1.5,
            mx: 0.5,
            mb: 0.5,
            borderRadius: 1.5,
            color: "error.light",
            "&:hover": {
              bgcolor: "error.dark",
              opacity: 0.9,
              color: "white",
            },
          }}
        >
          <SignOutIcon size={16} />
          <Typography variant="body2">Sign out</Typography>
        </MenuItem>
      </Menu>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign out"
        description="Are you sure you want to sign out?"
        confirmLabel="Sign out"
      />
    </Drawer>
  );
}
