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
  CaretDownIcon,
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
  onProfile?: () => void;
  onSignOut?: () => void;
}

export function UserDropdown({
  user,
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

  const handleProfile = () => {
    handleClose();
    onProfile?.();
  };

  const handleSignOut = () => {
    handleClose();
    onSignOut?.();
  };

  return (
    <Box>
      <Button
        aria-label="User menu"
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          gap: 1,
          textTransform: "none",
          borderRadius: 2,
          px: 1,
          color: "text.primary",
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
          }}
        >
          {userInitial}
        </Avatar>

        <Typography
          variant="body2"
          noWrap
          sx={{
            fontWeight: 500,
            maxWidth: 160,
          }}
        >
          {user?.name ?? "User"}
        </Typography>

        <CaretDownIcon
          size={14}
          style={{
            opacity: 0.4,
          }}
        />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 220,
              mt: 0.5,
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

        <MenuItem
          onClick={handleProfile}
          sx={{
            gap: 1.5,
            mt: 1,
            mx: 0.5,
            borderRadius: 1.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto",
              color: "inherit",
            }}
          >
            <UserCircleIcon size={16} />
          </ListItemIcon>

          <Typography variant="body2">Profile</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleSignOut}
          sx={{
            gap: 1.5,
            mt: 0.5,
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
          <ListItemIcon
            sx={{
              minWidth: "auto",
              color: "inherit",
            }}
          >
            <SignOutIcon size={16} />
          </ListItemIcon>

          <Typography variant="body2">Sign out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
