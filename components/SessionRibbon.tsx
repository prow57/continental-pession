"use client";

import Image from "next/image";

const SESSION = {
  user: "T. Banda",
  role: "Senior authorizer",
  office: "Lilongwe HQ",
  sessionExpires: "18:30",
};

export function SessionRibbon() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-auto object-contain opacity-95" aria-hidden />
        <span className="font-semibold text-white">Signed in</span>
        <span>
          {SESSION.user} · {SESSION.role}
        </span>
        <span className="hidden text-slate-400 sm:inline">{SESSION.office}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-400">
        <span title="Idle timeout">Session ends {SESSION.sessionExpires}</span>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">TLS</span>
      </div>
    </div>
  );
}
