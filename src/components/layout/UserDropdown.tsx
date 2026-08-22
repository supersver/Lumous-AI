import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  CaretUpDownIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

interface User {
  name?: string;
  email?: string;
}

interface UserDropdownProps {
  user?: User | null;
  collapsed?: boolean;
  fullWidth?: boolean;
  onProfile?: () => void;
  onSignOut?: () => void;
}

export function UserDropdown({
  user,
  collapsed = false,
  fullWidth = false,
  onProfile,
  onSignOut,
}: UserDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      label: "Profile",
      icon: UserCircleIcon,
      onClick: onProfile,
    },
    {
      label: "Sign out",
      icon: SignOutIcon,
      onClick: onSignOut,
      color: "error.light",
      hover: {
        bgcolor: "error.dark",
        opacity: 0.9,
        color: "white",
      },
    },
  ];

  return (
    <>
      <Button
        aria-label="User menu"
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          width: fullWidth ? "100%" : "auto",
          minWidth: 0,
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 1,
          px: collapsed ? 0.75 : 1,
          py: 0.75,
          borderRadius: 2,
          textTransform: "none",
          color: "text.primary",
          flexShrink: 0,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Avatar
          sx={{
            width: 28,
            height: 28,
            fontSize: 12,
            bgcolor: "secondary.dark",
            color: "text.primary",
            flexShrink: 0,
          }}
        >
          {userInitial}
        </Avatar>

        {!collapsed && (
          <>
            <Box
              sx={{
                minWidth: 0,
                flex: fullWidth ? 1 : "unset",
                textAlign: "left",
              }}
            >
              <Typography
                variant="caption"
                noWrap
                sx={{
                  display: "block",
                  fontWeight: 500,
                  maxWidth: fullWidth ? "100%" : 160,
                }}
              >
                {user?.name ?? "User"}
              </Typography>
            </Box>

            <CaretUpDownIcon
              size={14}
              style={{
                flexShrink: 0,
                opacity: 0.4,
              }}
            />
          </>
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: collapsed ? "top" : "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: collapsed ? "bottom" : "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 220,
              mt: collapsed ? 0 : 0.5,
              mb: collapsed ? 0.5 : 0,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              display: "block",
            }}
          >
            {user?.name ?? "User"}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.email ?? ""}
          </Typography>
        </Box>

        <Divider />

        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <MenuItem
              key={item.label}
              onClick={() => {
                handleClose();
                item.onClick?.();
              }}
              sx={{
                mt: index === 0 ? 1 : 0.5,
                mx: 0.5,
                mb: index === menuItems.length - 1 ? 0.5 : 0,
                borderRadius: 1.5,
                color: item.color ?? "inherit",
                "&:hover": item.hover,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  width: 16,
                  mr: 1,
                  color: "inherit",
                }}
              >
                <Icon size={16} />
              </ListItemIcon>

              <Typography variant="body2">{item.label}</Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
