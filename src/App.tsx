import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import { AppRoutes } from "./routes/AppRoutes";
import { AppFallback } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      <AppRoutes />
      <ToastContainer position="top-right" theme="dark" />
    </ErrorBoundary>
  );
}
