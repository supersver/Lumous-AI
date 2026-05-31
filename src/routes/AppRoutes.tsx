import { Route, Routes, Navigate } from "react-router-dom";
import Home from "@/pages/home";
import Login from "@/pages/auth/routes/Login";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? children : <Navigate replace to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? <Navigate replace to="/dashboard" /> : children;
}

export function AppRoutes() {
  return (
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
  );
}
