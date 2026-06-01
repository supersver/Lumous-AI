import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes, Navigate } from "react-router-dom";

import { auth } from "@/lib/firebase";
import { login } from "@/pages/auth/api/login";
import Home from "@/pages/home";
import Login from "@/pages/auth/routes/Login";
import { useAppStore } from "@/store/useAppStore";

function AuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-5 py-4 shadow-xl shadow-slate-950/30">
        <span
          aria-hidden="true"
          className="size-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-300"
        />
        <span className="text-sm font-medium text-slate-300">
          Restoring session
        </span>
      </div>
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
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      /> */}

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </AuthGate>
  );
}
