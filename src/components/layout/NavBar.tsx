import { useState } from "react";
import { Box, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { Modal } from "@/components/elements/Modal";
import { useAppStore } from "@/store/useAppStore";
import { UserDropdown } from "./UserDropdown";
import LogoWithName from "../elements/Logo";

export function NavBar() {
  const navigate = useNavigate();

  const user = useAppStore((s) => s.user);
  const clearUser = useAppStore((s) => s.clearUser);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await signOut(auth);
    clearUser();
    navigate("/login");
  };

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        width: "100%",
        px: 2,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Button
        sx={{
          p: 0.5,
          minWidth: 0,
          display: "flex",
          gap: "6px",
          textTransform: "none",
        }}
        onClick={() => navigate("/")}
      >
        <LogoWithName height={20} />
      </Button>

      <UserDropdown
        user={user}
        onProfile={() => navigate("/profile")}
        onSignOut={() => setIsLogoutModalOpen(true)}
      />

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign out"
        description="Are you sure you want to sign out?"
        confirmLabel="Sign out"
        maxWidth={500}
      />
    </Box>
  );
}
