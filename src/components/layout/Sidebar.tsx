import {
  Box,
  Typography,
  Avatar,
  Drawer,
  IconButton,
  Tooltip,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  List,
  Menu,
  MenuItem,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { useState } from "react";
import {
  GearSixIcon,
  SignOutIcon,
  RobotIcon,
  ChartBarIcon,
  CaretUpDownIcon,
  SidebarSimpleIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { Modal } from "@/components/elements/Modal";
import { useAppStore } from "@/store/useAppStore";
import { ChatSidebarHistory } from "./ChatSidebarHistory";

const DRAWER_WIDTH = 256;
const COLLAPSED_WIDTH = 64;

const navItems = [
  { to: "/analytics", label: "Analytics", icon: ChartBarIcon },
  { to: "/settings", label: "Settings", icon: GearSixIcon },
];

const TRANSITION = "width 0.2s ease, padding 0.2s ease";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const clearUser = useAppStore((s) => s.clearUser);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;
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
        width,
        flexShrink: 0,
        transition: TRANSITION,
        "& .MuiDrawer-paper": {
          width,
          transition: TRANSITION,
          overflowX: "hidden",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          px: collapsed ? 1 : 1.5,
          py: 2,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 1,
          pb: 2,
          minHeight: 36,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <RobotIcon size={22} color="#818cf8" weight="duotone" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              ModelPilot
            </Typography>
          </Box>
        )}

        <Tooltip
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          placement="right"
        >
          <IconButton
            size="small"
            onClick={onToggle}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            {collapsed ? (
              <Box
                sx={{
                  display: "flex",
                  gap: "3px",
                  alignItems: "center",
                }}
              >
                <RobotIcon size={22} color="#818cf8" weight="duotone" />
                <CaretRightIcon />
              </Box>
            ) : (
              <SidebarSimpleIcon size={18} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <ChatSidebarHistory collapsed={collapsed} />

      <Divider sx={{ my: 1.5 }} />

      {/* Nav items */}
      <List dense disablePadding>
        {navItems.map(({ to, label, icon: Icon }) => (
          <Tooltip key={to} title={collapsed ? label : ""} placement="right">
            <ListItemButton
              component={NavLink}
              to={to}
              sx={{
                mb: 0.5,
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1 : 2,
                "&.active": {
                  bgcolor: "action.selected",
                  color: "text.primary",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? "auto" : 36,
                  color: "inherit",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={label}
                  slotProps={{ primary: { variant: "body2" } }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      {/* User section */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 1.5 }} />

        <Tooltip
          title={collapsed ? (user?.name ?? "User") : ""}
          placement="right"
        >
          <ListItemButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{
              borderRadius: 2,
              gap: 1,
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 1 : 2,
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
            {!collapsed && (
              <>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ fontWeight: 500, display: "block" }}
                  >
                    {user?.name ?? "User"}
                  </Typography>
                </Box>
                <CaretUpDownIcon
                  size={14}
                  style={{ flexShrink: 0, opacity: 0.4 }}
                />
              </>
            )}
          </ListItemButton>
        </Tooltip>
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
              width: 200,
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
            "&:hover": { bgcolor: "error.dark", opacity: 0.9, color: "white" },
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
