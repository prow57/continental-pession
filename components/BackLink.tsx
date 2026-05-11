import Link from "next/link";
import type { ReactNode } from "react";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-semibold text-cps-800 hover:text-cps-950">
      <span aria-hidden>←</span> {children}
    </Link>
  );
}
