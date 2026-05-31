import { useAppStore } from "../store/useAppStore";

export default function Home() {
  const { count, increment } = useAppStore();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-8 text-slate-100">
      <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-sm">
        <h1 className="text-4xl font-semibold">ModelPilot</h1>
        <p className="mt-4 text-slate-400">
          A React + TypeScript starter with Tailwind, Zustand, React Query,
          Router, Axios, Firebase, and icons.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-slate-950 p-4">
            <p className="text-sm text-slate-500">
              Counter state managed by Zustand
            </p>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-3xl font-bold">{count}</span>
              <button
                onClick={increment}
                className="rounded-full bg-slate-700 px-5 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600"
              >
                Increment
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
