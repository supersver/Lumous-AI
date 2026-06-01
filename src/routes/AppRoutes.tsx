import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes, Navigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { login, Login } from "@/pages/auth";
import { Chats } from "@/pages/chats";
import { useAppStore } from "@/store/useAppStore";
import { SpinnerGapIcon } from "@phosphor-icons/react";
import { MainLayout } from "@/components/layout";
import { Settings } from "@/pages/settings";

function AuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <SpinnerGapIcon size={28} className="animate-spin" />
    </main>
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
          <Route path="/" element={<Chats />} />
          {/* <Route path="/chats" element={<Chats />} /> */}
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </AuthGate>
  );
}
