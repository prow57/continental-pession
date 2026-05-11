"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/pension/employer-schemes", label: "Employer schemes" },
  { href: "/pension/members", label: "Members" },
];

export default function PensionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Pension</h1>
        <p className="text-xs text-slate-600">Employer schemes and members (restricted and unrestricted).</p>
      </div>

      <div className="cps-panel">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-cps-200/70 bg-cps-50/70 px-3 py-2">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                pathname === tab.href
                  ? "border-cps-700 bg-cps-800 text-white"
                  : "border-cps-300/80 bg-white text-cps-900 hover:border-amber-400/70 hover:bg-amber-50/80"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
