import React, { useEffect } from "react";
import type { Toast } from "../types";

type ToastContainerProps = {
  toasts: Toast[];
  onRemove: (id: string) => void;
  autoCloseDuration?: number;
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  autoCloseDuration = 3000,
}) => {
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      const oldestToast = toasts[0];
      if (oldestToast) {
        onRemove(oldestToast.id);
      }
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [toasts, onRemove, autoCloseDuration]);

  const getToastColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  const getToastIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 space-y-2 sm:inset-x-auto sm:right-4 sm:left-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-in fade-in slide-in-from-right-2 w-full rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/40 ring-1 ring-white/10 transition sm:w-auto sm:max-w-sm ${getToastColor(
            toast.type,
          )}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{getToastIcon(toast.type)}</span>
            <span className="break-words">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-auto text-white/70 hover:text-white"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
