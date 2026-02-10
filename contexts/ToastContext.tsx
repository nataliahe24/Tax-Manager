"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  onUndo?: () => void;
  createdAt: number;
  exiting?: boolean;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (
    title: string,
    message: string,
    type?: ToastType,
    options?: { onUndo?: () => void },
  ) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 3000;

function generateToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      title: string,
      message: string,
      type: ToastType = "success",
      options?: { onUndo?: () => void },
    ) => {
      const id = generateToastId();
      const item: ToastItem = {
        id,
        title,
        message,
        type,
        onUndo: options?.onUndo,
        createdAt: Date.now(),
      };
      setToasts((prev) => [...prev, item]);
      const exitDuration = 300;
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
        );
      }, DURATION_MS - exitDuration);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, dismissToast } = useContext(ToastContext)!;
  return (
    <div
      className="pointer-events-none fixed top-4 right-4 z-50 flex max-w-[min(100vw-2rem,24rem)] flex-col gap-2 sm:top-6 sm:right-6"
      aria-label="Notificaciones"
      role="region"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

const TYPE_STYLES: Record<
  ToastType,
  {
    bg: string;
    border: string;
    title: string;
    dark: { bg: string; border: string; title: string };
  }
> = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "text-emerald-800",
    dark: {
      bg: "dark:bg-emerald-950/90",
      border: "dark:border-emerald-800",
      title: "dark:text-emerald-200",
    },
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    title: "text-red-800",
    dark: {
      bg: "dark:bg-red-950/90",
      border: "dark:border-red-800",
      title: "dark:text-red-200",
    },
  },
  info: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    title: "text-slate-800",
    dark: {
      bg: "dark:bg-slate-800/95",
      border: "dark:border-slate-600",
      title: "dark:text-slate-200",
    },
  },
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const styles = TYPE_STYLES[toast.type];
  const exiting = toast.exiting || isExiting;

  const handleUndo = () => {
    setIsExiting(true);
    toast.onUndo?.();
    setTimeout(() => onDismiss(toast.id), 200);
  };

  const handleAnimationEnd = () => {
    if (toast.exiting) onDismiss(toast.id);
  };

  return (
    <div
      id={toast.id}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onAnimationEnd={handleAnimationEnd}
      className={`pointer-events-auto flex flex-col gap-1.5 rounded-lg border px-4 py-3 shadow-lg ${styles.bg} ${styles.border} ${styles.dark.bg} ${styles.dark.border} ${
        exiting ? "animate-toast-out" : "animate-toast-in"
      }`}
    >
      <p
        className={`text-sm font-semibold ${styles.title} ${styles.dark.title}`}
      >
        {toast.title}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {toast.message}
      </p>
      {toast.onUndo && (
        <div className="mt-0.5 flex justify-end">
          <button
            type="button"
            onClick={handleUndo}
            className="rounded px-2 py-1 text-sm font-medium text-purple-600 underline-offset-2 hover:underline dark:text-purple-400"
            aria-label="Deshacer acción"
          >
            Deshacer
          </button>
        </div>
      )}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
