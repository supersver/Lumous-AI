import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import { AppRoutes } from "./routes/AppRoutes";
import { AppFallback } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <AppRoutes />
        <ToastContainer position="top-right" theme="dark" />
      </div>
    </ErrorBoundary>
  );
}
