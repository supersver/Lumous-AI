import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  GearSixIcon,
  SignOutIcon,
  RobotIcon,
  ChartBarIcon,
} from "@phosphor-icons/react";
import { auth } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";
import { ChatSidebarHistory } from "./ChatSidebarHistory";

const navItems = [
  { to: "/analytics", label: "Analytics", icon: ChartBarIcon },
  { to: "/settings", label: "Settings", icon: GearSixIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const clearUser = useAppStore((s) => s.clearUser);

  const handleLogout = async () => {
    await signOut(auth);
    clearUser();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 px-3 py-4">
      <div className="flex items-center gap-2.5 px-2 pb-4 pt-1">
        <RobotIcon size={24} className="text-indigo-400" weight="duotone" />
        <span className="text-base font-semibold tracking-tight text-slate-100">
          ModelPilot
        </span>
      </div>

      <ChatSidebarHistory />

      <nav className="mt-3 flex flex-col gap-0.5 border-t border-slate-800 pt-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-3">
        <div className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-medium text-indigo-300">
            {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-200">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-red-400"
        >
          <SignOutIcon size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
