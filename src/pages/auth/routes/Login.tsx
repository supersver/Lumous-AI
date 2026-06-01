import { useState } from "react";
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { auth } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";
import { login } from "../api/login";

const googleProvider = new GoogleAuthProvider();

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 48 48"
      focusable="false"
    >
      <path
        fill="#FFC107"
        d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);

      const res = await login();

      if (!res.user) {
        toast.error("Login succeeded, but no user profile was returned.");
        return;
      }

      setUser(res.user);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-100 text-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden min-h-screen flex-col justify-between bg-slate-950 px-12 py-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-cyan-300 text-base font-black text-slate-950">
            MP
          </div>
          <div>
            <p className="text-base font-semibold">ModelPilot</p>
            <p className="text-xs font-medium uppercase text-cyan-200">
              Workspace
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase text-amber-300">
            Welcome back
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-white">
            Pick up your model workflow where you left it.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Sign in with Google to return to your ModelPilot workspace.
          </p>
        </div>

        <p className="text-sm text-slate-500">ModelPilot account access</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid size-11 place-items-center rounded-lg bg-slate-950 text-base font-black text-cyan-200">
              MP
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">
                ModelPilot
              </p>
              <p className="text-xs font-medium uppercase text-slate-500">
                Workspace
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/40 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-700">
                Sign in
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Continue to ModelPilot
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use the Google account connected to your workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              aria-busy={loading}
              className="mt-8 inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span
                  aria-hidden="true"
                  className="size-5 rounded-full border-2 border-slate-300 border-t-slate-950 animate-spin"
                />
              ) : (
                <GoogleIcon />
              )}
              <span>{loading ? "Signing in..." : "Continue with Google"}</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
