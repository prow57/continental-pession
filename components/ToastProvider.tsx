"use client";

import React, { createContext, useCallback, useContext, useId, useMemo, useState } from "react";

type ToastTone = "success" | "error" | "info";

type ToastItem = { id: string; message: string; tone: ToastTone };

type ToastContextValue = {
  pushToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const baseId = useId();

  const pushToast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = `${baseId}-${Math.random().toString(36).slice(2, 9)}`;
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, [baseId]);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex max-w-[min(100vw-2rem,22rem)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-lg border px-3 py-2 text-sm shadow-lg ${
              t.tone === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                : t.tone === "error"
                  ? "border-red-300 bg-red-50 text-red-950"
                  : "border-slate-300 bg-white text-slate-900"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
