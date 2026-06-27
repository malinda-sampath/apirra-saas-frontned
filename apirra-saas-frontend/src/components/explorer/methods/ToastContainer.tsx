import React, { useEffect } from "react";
import type { Toast } from "../../../types/methodTypes";

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
    <div className="fixed right-4 top-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-in fade-in slide-in-from-right-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition ${getToastColor(
            toast.type,
          )}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{getToastIcon(toast.type)}</span>
            <span>{toast.message}</span>
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
