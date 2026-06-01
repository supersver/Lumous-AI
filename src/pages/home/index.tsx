import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const handleLogout = async () => {
    await signOut(auth);
    logout();
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-8 text-slate-100">
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/30">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="size-16 rounded-lg border border-slate-700 object-cover"
              />
            ) : (
              <div className="grid size-16 place-items-center rounded-lg bg-cyan-400 text-xl font-semibold text-slate-950">
                {user?.name?.charAt(0).toUpperCase() || "M"}
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-cyan-300">ModelPilot</p>
              <h1 className="mt-1 text-3xl font-semibold text-white">
                Welcome back{user?.name ? `, ${user.name}` : ""}.
              </h1>
              {user?.email ? (
                <p className="mt-2 text-sm text-slate-400">{user.email}</p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}
