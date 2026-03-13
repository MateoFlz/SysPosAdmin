interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
