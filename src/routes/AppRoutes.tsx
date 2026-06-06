import { useEffect, lazy, Suspense, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes, Navigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { login } from "@/pages/auth";
import { useAppStore } from "@/store/useAppStore";
import { CircularProgress, Box } from "@mui/material";
import { useShallow } from "zustand/shallow";

const Login = lazy(() =>
  import("@/pages/auth").then((m) => ({ default: m.Login })),
);
const Chats = lazy(() =>
  import("@/pages/chats").then((m) => ({ default: m.Chats })),
);
const ChatIndexRedirect = lazy(() =>
  import("@/pages/chats").then((m) => ({ default: m.ChatIndexRedirect })),
);
const Settings = lazy(() =>
  import("@/pages/settings").then((m) => ({ default: m.Settings })),
);
const Analytics = lazy(() =>
  import("@/pages/analytics").then((m) => ({ default: m.Analytics })),
);
const MainLayout = lazy(() =>
  import("@/components/layout").then((m) => ({ default: m.MainLayout })),
);

function PageLoader() {
  return (
    <Box
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
  const { authReady, clearUser, setAuthReady, setUser } = useAppStore(
    useShallow((state) => ({
      authReady: state.authReady,
      clearUser: state.clearUser,
      setAuthReady: state.setAuthReady,
      setUser: state.setUser,
    })),
  );

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
        if (res.user) setUser(res.user);
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

  return authReady ? children : <PageLoader />;
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

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
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </AuthGate>
  );
}
