"use client";

import type { ReactNode } from "react";
import React from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, title, onClose, children, footer }: Props) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="cps-modal-title">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(92vh,640px)] w-full max-w-lg flex-col rounded-t-xl border border-cps-200 bg-white shadow-2xl sm:rounded-xl">
        <div className="flex items-start justify-between gap-2 border-b border-cps-200 px-4 py-3">
          <h2 id="cps-modal-title" className="text-base font-bold text-cps-950">
            {title}
          </h2>
          <button type="button" className="cps-btn shrink-0 py-1 text-[11px]" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>
        {footer ? <div className="border-t border-cps-200 px-4 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}
