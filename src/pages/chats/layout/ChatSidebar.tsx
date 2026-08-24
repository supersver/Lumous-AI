import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { signOut } from "firebase/auth";
import {
  GearSixIcon,
  SidebarSimpleIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { Modal } from "@/components/elements/Modal";
import LogoWithName from "@/components/elements/Logo";
import { useAppStore } from "@/store/useAppStore";

import { ChatSidebarHistory } from "./ChatSidebarHistory";
import logo from "@/assets/logo.svg";
import { useState } from "react";
import { UserDropdown } from "@/components/layout/UserDropdown";

const DRAWER_WIDTH = 256;
const COLLAPSED_WIDTH = 64;
const TRANSITION = "width 0.2s ease, padding 0.2s ease";

const navItems = [
  {
    to: "/chats/settings",
    label: "Settings",
    icon: GearSixIcon,
  },
];

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function ChatSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: ChatSidebarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = useAppStore((state) => state.user);
  const clearUser = useAppStore((state) => state.clearUser);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const effectiveCollapsed = isMobile ? false : collapsed;
  const width = effectiveCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      clearUser();
      setIsLogoutModalOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const drawerContent = (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: effectiveCollapsed ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          pb: 2,
          minHeight: effectiveCollapsed ? 76 : 36,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <Tooltip title="Back to home" placement="right">
            <IconButton
              size="small"
              aria-label="Back to home"
              onClick={() => {
                navigate("/");

                if (isMobile) {
                  onMobileClose();
                }
              }}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                },
              }}
            >
              <ArrowLeftIcon size={18} />
            </IconButton>
          </Tooltip>

          {!effectiveCollapsed && (
            <Button
              size="small"
              sx={{
                ml: 0.5,
                display: "flex",
                gap: "5px",
                textTransform: "none",
              }}
              onClick={() => {
                navigate("/");

                if (isMobile) {
                  onMobileClose();
                }
              }}
            >
              <LogoWithName height={20} />
            </Button>
          )}
        </Box>

        {/* Collapse toggle */}
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
                "&:hover": {
                  color: "text.primary",
                },
              }}
            >
              {effectiveCollapsed ? (
                <Box
                  sx={{
                    display: "flex",
                    gap: "3px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={logo}
                    alt="Lumous AI"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </Box>
              ) : (
                <SidebarSimpleIcon size={18} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Chat history */}
      <ChatSidebarHistory collapsed={effectiveCollapsed} />

      <Divider sx={{ my: 1.5 }} />

      {/* Navigation */}
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
                if (isMobile) {
                  onMobileClose();
                }
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
                  slotProps={{
                    primary: {
                      variant: "body2",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      {/* User section */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 1.5 }} />

        <UserDropdown
          user={user}
          collapsed={effectiveCollapsed}
          fullWidth
          onProfile={() => {
            navigate("/profile");
          }}
          onSignOut={() => {
            setIsLogoutModalOpen(true);
          }}
        />
      </Box>

      {/* Logout confirmation */}
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
      {/* Mobile */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true,
          }}
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
        /* Desktop */
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
