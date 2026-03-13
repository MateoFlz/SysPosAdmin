import { Outlet } from "react-router";

import { Sidebar } from "./Sidebar.tsx";

export function AppLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
