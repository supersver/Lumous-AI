import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { auth } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";
import { login } from "../api/login";

const googleProvider = new GoogleAuthProvider();

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 48 48"
      focusable="false"
    >
      <path
        fill="#FFC107"
        d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"
      />
    </svg>
  );
}

function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 44,
          height: 44,
          borderRadius: 1,
          bgcolor: inverted ? "grey.900" : "primary.main",
          color: inverted ? "primary.light" : "primary.contrastText",
          typography: "subtitle1",
          fontWeight: 800,
        }}
      >
        MP
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: inverted ? "grey.100" : "text.primary",
          }}
        >
          ModelPilot
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: inverted ? "primary.light" : "text.secondary",
          }}
        >
          Workspace
        </Typography>
      </Box>
    </Stack>
  );
}

export function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);

      const res = await login();

      if (!res.user) {
        toast.error("Login succeeded, but no user profile was returned.");
        return;
      }

      setUser(res.user);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        display: "grid",
        minHeight: "100vh",
        gridTemplateColumns: { lg: "1.05fr 0.95fr" },
        bgcolor: "grey.100",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          minHeight: "100vh",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "grey.900",
          color: "grey.100",
          px: 6,
          py: 5,
        }}
      >
        <BrandMark />
        <Box sx={{ maxWidth: 560 }}>
          <Typography
            variant="overline"
            sx={{ color: "warning.light", fontWeight: 600, letterSpacing: 1 }}
          >
            Welcome!
          </Typography>
          <Typography
            variant="h3"
            sx={{ mt: 2, fontWeight: 600, lineHeight: 1.2 }}
          >
            Pick up your model. Chat. Analyze.
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, color: "grey.400", lineHeight: 1.7 }}
          >
            Sign in with Google to return to your ModelPilot workspace.
          </Typography>
        </Box>
        <Typography variant="body2" color="grey.600">
          ModelPilot account access
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2.5, sm: 4 },
          py: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          <Box sx={{ mb: 4, display: { xs: "block", lg: "none" } }}>
            <BrandMark />
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, sm: 4 },
              border: 1,
              borderColor: "grey.200",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: "primary.dark", fontWeight: 600, letterSpacing: 1 }}
            >
              Sign in
            </Typography>
            <Typography variant="h4" sx={{ mt: 1.5, fontWeight: 600 }}>
              Continue to ModelPilot
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, lineHeight: 1.7 }}
            >
              Use the Google account connected to your workspace.
            </Typography>

            <Button
              type="button"
              variant="outlined"
              fullWidth
              disabled={loading}
              aria-busy={loading}
              onClick={handleGoogleLogin}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <GoogleIcon />
                )
              }
              sx={{
                mt: 4,
                height: 48,
                justifyContent: "center",
                borderColor: "grey.300",
                color: "grey.900",
                bgcolor: "grey.50",
                "&:hover": {
                  borderColor: "grey.400",
                  bgcolor: "grey.400",
                },
              }}
            >
              {loading ? "Signing in..." : "Continue with Google"}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
