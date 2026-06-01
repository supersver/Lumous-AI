type FallbackProps = {
  error: any;
  resetErrorBoundary: () => void;
};

export function AppFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      <div className="max-w-xl rounded-3xl border border-rose-500/30 bg-slate-900 p-8 text-left shadow-2xl shadow-slate-950/30">
        <h2 className="text-2xl font-semibold text-rose-200">
          Something went wrong
        </h2>
        <p className="mt-4 text-slate-400">
          {error?.message ?? "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="mt-6 rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
