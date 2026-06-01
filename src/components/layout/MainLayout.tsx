import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
