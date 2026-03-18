import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Info, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Button } from "./Button.tsx";

const variants = {
  destructive: {
    icon: Trash2,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
    confirmVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    confirmVariant: "primary" as const,
  },
  default: {
    icon: Info,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    confirmVariant: "primary" as const,
  },
} as const;

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: keyof typeof variants;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  const config = variants[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    } else {
      setAnimating(false);
      const timeout = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-200",
          animating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl transition-all duration-200",
          animating
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full mb-4",
              config.iconBg
            )}
          >
            <Icon className={cn("h-6 w-6", config.iconColor)} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="mt-2 text-sm text-muted-foreground">{message}</div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            className="flex-1"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
