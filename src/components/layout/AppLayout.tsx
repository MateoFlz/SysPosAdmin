import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router";

import { Sidebar } from "./Sidebar.tsx";

interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  open: false,
  toggle: () => {},
  close: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function AppLayout() {
  const [open, setOpen] = useState(false);

  const contextValue: SidebarContextValue = {
    open,
    toggle: () => setOpen((prev) => !prev),
    close: () => setOpen(false),
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="flex h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-64">
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
