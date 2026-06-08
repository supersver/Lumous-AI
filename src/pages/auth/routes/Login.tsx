import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "@/assets/logo.svg";
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
      {/* ── Left dark panel (unchanged) ── */}
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
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={logo}
            alt="Lumous AI"
            style={{ width: "auto", height: 40 }}
          />
          <Typography
            component="span"
            sx={{
              fontSize: "2rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "text.primary",
            }}
          >
            Lumous AI
          </Typography>
        </Box>
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
            One Workspace. Every AI Model.
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, color: "grey.400", lineHeight: 1.7 }}
          >
            Connect GPT, Claude, Gemini, DeepSeek, and more using your own API
            keys. Track usage, compare models, and manage conversations from a
            single dashboard.
          </Typography>
        </Box>
        <Typography variant="body2" color="grey.600">
          Lumous AI account access
        </Typography>
      </Box>

      {/* ── Right panel: dot grid background ── */}
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2.5, sm: 4 },
          py: 4,
          position: "relative",
          overflow: "hidden",
          // Dot grid
          backgroundColor: "#f5f6fa",
          backgroundImage:
            "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* Accent glow blobs */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(ellipse 65% 55% at 10% 85%, rgba(99,102,241,0.12) 0%, transparent 70%),
              radial-gradient(ellipse 55% 45% at 90% 15%, rgba(129,140,248,0.09) 0%, transparent 70%)
            `,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Decorative SVG lines + rings */}
        <Box
          aria-hidden="true"
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <line
            x1="0"
            y1="75%"
            x2="38%"
            y2="25%"
            stroke="#6366f1"
            strokeWidth="0.7"
            opacity="0.12"
          />
          <line
            x1="100%"
            y1="15%"
            x2="60%"
            y2="70%"
            stroke="#818cf8"
            strokeWidth="0.7"
            opacity="0.10"
          />
          <line
            x1="8%"
            y1="0"
            x2="48%"
            y2="58%"
            stroke="#6366f1"
            strokeWidth="0.5"
            opacity="0.08"
          />
          <circle
            cx="10%"
            cy="12%"
            r="40"
            fill="none"
            stroke="#6366f1"
            strokeWidth="0.6"
            opacity="0.13"
          />
          <circle
            cx="88%"
            cy="88%"
            r="55"
            fill="none"
            stroke="#818cf8"
            strokeWidth="0.6"
            opacity="0.10"
          />
          <circle
            cx="85%"
            cy="14%"
            r="22"
            fill="none"
            stroke="#6366f1"
            strokeWidth="0.5"
            opacity="0.10"
          />
        </Box>

        {/* Card */}
        <Box
          sx={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, sm: 4 },
              border: 1,
              borderColor: "grey.200",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Box
              sx={{
                mb: 4,
                display: { xs: "flex", lg: "none" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <img
                src={logo}
                alt="Lumous AI"
                style={{ width: "auto", height: 40 }}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                }}
              >
                Lumous AI
              </Typography>
            </Box>

            <Typography
              variant="overline"
              sx={{ color: "primary.dark", fontWeight: 600, letterSpacing: 1 }}
            >
              Sign in
            </Typography>
            <Typography variant="h4" sx={{ mt: 1.5, fontWeight: 600 }}>
              Continue to Lumous AI
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
                loading ? <CircularProgress size={20} /> : <GoogleIcon />
              }
              sx={{
                mt: 4,
                height: 48,
                justifyContent: "center",
                borderColor: "grey.300",
                color: "grey.900",
                bgcolor: "grey.50",
                "&:hover": { borderColor: "grey.400", bgcolor: "grey.400" },
                "&:disabled": { color: "grey.900" },
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
