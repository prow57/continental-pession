"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const SESSION = {
  user: "T. Banda",
  role: "Senior authorizer",
  office: "Lilongwe HQ",
  sessionExpires: "18:30",
};

export function SessionRibbon() {
  const router = useRouter();

  const logout = () => {
    document.cookie = "cps_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "cps_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex shrink-0 rounded-md border border-slate-200/90 bg-white p-0.5 shadow-sm ring-1 ring-black/5" aria-hidden>
          <div className="rounded bg-slate-50 p-0.5 ring-1 ring-slate-200/80">
            <Image src="/logo.png" alt="" width={28} height={28} className="h-6 w-auto object-contain" aria-hidden />
          </div>
        </div>
        <span className="font-semibold text-white">Signed in</span>
        <span>
          {SESSION.user} · {SESSION.role}
        </span>
        <span className="hidden text-slate-400 sm:inline">{SESSION.office}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-400">
        <span title="Idle timeout">Session ends {SESSION.sessionExpires}</span>
        <button type="button" className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200 hover:bg-slate-700" onClick={logout}>
          Logout
        </button>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">TLS</span>
      </div>
    </div>
  );
}
