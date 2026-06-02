import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes, Navigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { login, Login } from "@/pages/auth";
import { Chats, ChatIndexRedirect } from "@/pages/chats";
import { useAppStore } from "@/store/useAppStore";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { MainLayout } from "@/components/layout";
import { Settings } from "@/pages/settings";

function AuthLoading() {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress size={28} />
    </Box>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const authReady = useAppStore((state) => state.authReady);
  const clearUser = useAppStore((state) => state.clearUser);
  const setAuthReady = useAppStore((state) => state.setAuthReady);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        clearUser();
        setAuthReady(true);
        return;
      }

      const storedUser = useAppStore.getState().user;

      if (storedUser?.firebaseUid === firebaseUser.uid) {
        setAuthReady(true);
      }

      try {
        const res = await login();

        if (res.user) {
          setUser(res.user);
        }
      } catch {
        const latestUser = useAppStore.getState().user;

        if (!latestUser || latestUser.firebaseUid !== firebaseUser.uid) {
          clearUser();
        }
      } finally {
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, [clearUser, setAuthReady, setUser]);

  return authReady ? children : <AuthLoading />;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAppStore((state) => state.user);
  return user ? children : <Navigate replace to="/login" />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const user = useAppStore((state) => state.user);
  return user ? <Navigate replace to="/" /> : children;
}

export function AppRoutes() {
  return (
    <AuthGate>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<ChatIndexRedirect />} />
          <Route path="/chat/:id" element={<Chats />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </AuthGate>
  );
}
