import { Outlet } from "react-router-dom";

import { ChatSessionsProvider } from "@/pages/chats/context/ChatSessionsContext";
import Sidebar from "./Sidebar";

export function MainLayout() {
  return (
    <ChatSessionsProvider>
      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
        <Sidebar />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </ChatSessionsProvider>
  );
}
