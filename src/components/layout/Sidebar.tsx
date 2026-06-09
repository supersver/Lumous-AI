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
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { useState } from "react";
import {
  GearSixIcon,
  SignOutIcon,
  ChartBarIcon,
  CaretUpDownIcon,
  SidebarSimpleIcon,
} from "@phosphor-icons/react";
import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { Modal } from "@/components/elements/Modal";
import { useAppStore } from "@/store/useAppStore";
import { ChatSidebarHistory } from "./ChatSidebarHistory";
import logo from "@/assets/logo.svg";

const DRAWER_WIDTH = 256;
const COLLAPSED_WIDTH = 64;
const TRANSITION = "width 0.2s ease, padding 0.2s ease";

const navItems = [
  { to: "/analytics", label: "Analytics", icon: ChartBarIcon },
  { to: "/settings", label: "Settings", icon: GearSixIcon },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = useAppStore((s) => s.user);
  const clearUser = useAppStore((s) => s.clearUser);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // On mobile: always full-width, never collapsed
  const effectiveCollapsed = isMobile ? false : collapsed;
  const width = effectiveCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await signOut(auth);
    clearUser();
    navigate("/login");
  };

  const drawerContent = (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: effectiveCollapsed ? "center" : "space-between",
          px: 1,
          pb: 2,
          minHeight: 36,
        }}
      >
        {!effectiveCollapsed && (
          <Button
            size="small"
            sx={{
              ml: "-10px",
              display: "flex",
              gap: "5px",
              textTransform: "none",
            }}
            onClick={() => {
              navigate("/");
              if (isMobile) onMobileClose();
            }}
          >
            <img
              src={logo}
              alt="Lumous AI"
              style={{ width: "auto", height: 25, display: "block" }}
            />
            <Typography
              component="span"
              sx={{
                fontSize: "1.25rem",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Lumous AI
            </Typography>
          </Button>
        )}

        {/* Hide collapse toggle on mobile */}
        {!isMobile && (
          <Tooltip
            title={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
              {effectiveCollapsed ? (
                <Box sx={{ display: "flex", gap: "3px", alignItems: "center" }}>
                  <img
                    src={logo}
                    alt="Lumous AI"
                    style={{ width: 30, height: 30 }}
                  />
                </Box>
              ) : (
                <SidebarSimpleIcon size={18} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <ChatSidebarHistory collapsed={effectiveCollapsed} />

      <Divider sx={{ my: 1.5 }} />

      <List dense disablePadding>
        {navItems.map(({ to, label, icon: Icon }) => (
          <Tooltip
            key={to}
            title={effectiveCollapsed ? label : ""}
            placement="right"
          >
            <ListItemButton
              component={NavLink}
              to={to}
              onClick={() => {
                if (isMobile) onMobileClose();
              }}
              sx={{
                mb: 0.5,
                justifyContent: effectiveCollapsed ? "center" : "flex-start",
                px: effectiveCollapsed ? 1 : 2,
                "&.active": {
                  bgcolor: "action.selected",
                  color: "text.primary",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: effectiveCollapsed ? "auto" : 36,
                  color: "inherit",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} />
              </ListItemIcon>
              {!effectiveCollapsed && (
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
          title={effectiveCollapsed ? (user?.name ?? "User") : ""}
          placement="right"
        >
          <ListItemButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{
              borderRadius: 2,
              gap: 1,
              justifyContent: effectiveCollapsed ? "center" : "flex-start",
              px: effectiveCollapsed ? 1 : 2,
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
            {!effectiveCollapsed && (
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
    </>
  );

  return (
    <>
      {/* Mobile: temporary overlay drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          sx={{
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
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop: permanent drawer */
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
              px: effectiveCollapsed ? 1 : 1.5,
              py: 2,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
