import { Menu } from "lucide-react";
import { useSidebar } from "./AppLayout.tsx";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
