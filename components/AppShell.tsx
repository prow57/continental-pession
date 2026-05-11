"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionRibbon } from "@/components/SessionRibbon";

const navGroups: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Home",
    items: [{ href: "/", label: "Overview" }],
  },
  {
    title: "Core funds",
    items: [
      { href: "/pension", label: "Pension" },
      { href: "/programmed-withdrawals", label: "Withdrawals" },
      { href: "/voluntary", label: "Voluntary" },
    ],
  },
  {
    title: "Cash movement",
    items: [
      { href: "/receipts", label: "Receipts" },
      { href: "/payments", label: "Payments" },
    ],
  },
  {
    title: "Control",
    items: [
      { href: "/finance", label: "Finance" },
      { href: "/compliance", label: "Compliance" },
      { href: "/reports", label: "Reports" },
    ],
  },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:flex lg:flex-col">
      <SessionRibbon />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside className="flex-shrink-0 border-b border-blue-900 bg-blue-950 text-white lg:sticky lg:top-0 lg:z-20 lg:flex lg:h-[calc(100dvh-2.5rem)] lg:w-56 lg:flex-col lg:self-start lg:overflow-hidden lg:border-b-0 lg:border-r lg:border-blue-900">
        <div className="border-b border-blue-800/60 px-3 py-3 lg:shrink-0 lg:border-b-0 lg:py-4">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-blue-700/80 bg-blue-900/40 px-2 py-3">
            <Image
              src="/logo.png"
              alt="Continental Holdings"
              width={200}
              height={120}
              className="h-auto w-full max-w-[9.5rem] object-contain drop-shadow-sm"
              priority
            />
            <div className="text-center">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300/95">Pension Services</span>
              <span className="mt-0.5 block text-[10px] leading-snug text-blue-200/85">Reserve Bank licensed · Malawi</span>
            </div>
          </div>
        </div>
        <nav className="max-h-[45vh] overflow-y-auto overscroll-contain px-2 pb-3 lg:max-h-none lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-2 lg:pb-5">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-3 last:mb-0">
              <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-blue-300/90">
                {group.title}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href === "/pension" && pathname.startsWith("/pension")) ||
                    (item.href === "/finance" && pathname.startsWith("/finance"));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block rounded-lg px-2.5 py-1.5 text-[13px] leading-snug transition ${
                          active
                            ? "border-l-[3px] border-l-sky-400 bg-blue-900 font-semibold text-white"
                            : "border-l-[3px] border-l-transparent text-blue-100/80 hover:bg-blue-900/70 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-3 sm:p-4 lg:p-5">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
      </div>
    </div>
  );
}
