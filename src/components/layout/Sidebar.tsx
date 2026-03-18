import { NavLink } from "react-router";
import { LayoutDashboard, Building2, Users, LogOut } from "lucide-react";

import { useAuth } from "@/context/AuthContext.tsx";
import { cn } from "@/lib/utils.ts";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Empresas", href: "/companies", icon: Building2 },
  { name: "Usuarios", href: "/users", icon: Users },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-6">
        <h1 className="text-lg font-bold tracking-tight">SysPOS Admin</h1>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
