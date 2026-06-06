import { type ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { WarningDiamondIcon, XIcon } from "@phosphor-icons/react";

type ModalVariant = "default" | "danger";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ModalVariant;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: ModalProps) {
  const isDanger = variant === "danger";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        },
      }}
      sx={{
        // Target the internal paper container to bypass the PaperProps TS error
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: 820,
          borderRadius: "16px",
          bgcolor: "#121214",
          backgroundImage: "none",
          border: "1px solid",
          borderColor: isDanger
            ? "rgba(239, 68, 68, 0.2)"
            : "rgba(255, 255, 255, 0.08)",
          boxShadow: isDanger
            ? "0 20px 40px -10px rgba(239,68,68,0.15), 0 0 0 1px rgba(239,68,68,0.05) inset"
            : "0 20px 40px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02) inset",
          overflow: "hidden",
          m: 2,
        },
      }}
    >
      <DialogTitle
        id="modal-title"
        sx={{
          px: 3,
          pt: 3,
          pb: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          {isDanger && (
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <WarningDiamondIcon size={20} weight="fill" />
            </Box>
          )}
          <Typography
            component="span"
            sx={{
              fontSize: "1.0625rem",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.95)",
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.4)",
            mt: -0.5,
            mr: -1,
            flexShrink: 0,
            transition: "all 0.2s ease",
            "&:hover": {
              color: "rgba(255,255,255,0.9)",
              backgroundColor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <XIcon fontSize="small" weight="bold" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1.5, pb: 0 }}>
        <DialogContentText
          id="modal-description"
          component="div"
          sx={{
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.6)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </DialogContentText>
      </DialogContent>

      <Divider sx={{ mx: 3, mt: 3.5, borderColor: "rgba(255,255,255,0.08)" }} />

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
        <Button
          onClick={onClose}
          disableElevation
          fullWidth
          sx={{
            height: 42,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.2)",
              color: "#fff",
            },
          }}
        >
          {cancelLabel}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          disableElevation
          fullWidth
          sx={{
            height: 42,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
            transition: "all 0.2s ease",
            ...(isDanger
              ? {
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#dc2626",
                  },
                }
              : {
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.85)",
                  },
                }),
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
