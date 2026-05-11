"use client";

import React from "react";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    const from = new URLSearchParams(window.location.search).get("from");
    const target = from && from.startsWith("/") ? from : "/";

    try {
      setError("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, from: target }),
      });
      const data = (await res.json()) as { status?: number; target?: string; message?: string };
      if (!res.ok || data?.status !== 1) {
        setError(data?.message ?? "Could not sign in. Please try again.");
        setBusy(false);
        return;
      }
      window.location.assign(data.target && data.target.startsWith("/") ? data.target : "/");
    } catch {
      setError("Network error while signing in.");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-3 sm:p-6">
      <div className="w-full max-w-md rounded-xl border border-blue-200/80 bg-blue-50/95 p-5 text-slate-800 shadow-2xl ring-1 ring-blue-100/80 backdrop-blur-sm sm:p-6">
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="Continental Holdings" width={120} height={72} className="h-auto w-24 object-contain" priority />
          <h1 className="text-lg font-bold tracking-tight text-blue-950">Sign in</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-medium text-red-700">{error}</div>
          ) : null}
          <div>
            <label htmlFor="login-username" className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              Username
            </label>
            <input
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-blue-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-blue-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md border border-amber-500/80 bg-gradient-to-b from-amber-300 to-amber-500 py-2 text-sm font-semibold text-amber-950 transition hover:from-amber-200 hover:to-amber-400 disabled:opacity-70"
            disabled={busy || !canSubmit}
          >
            {busy ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
