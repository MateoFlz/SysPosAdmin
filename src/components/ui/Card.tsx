import { cn } from "@/lib/utils.ts";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
