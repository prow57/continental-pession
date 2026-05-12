"use client";

import React from "react";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [destination, setDestination] = React.useState<string>("/");

  React.useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    setDestination(from && from.startsWith("/") ? from : "/");
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const from = new URLSearchParams(window.location.search).get("from");
    const target = from && from.startsWith("/") ? from : "/";

    try {
      setError("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, from: target }),
        credentials: "include",
      });
      const data = (await res.json()) as { status?: number; target?: string; message?: string };
      if (!res.ok || data?.status !== 1) {
        setError(data?.message ?? "Could not sign in. Please try again.");
        setBusy(false);
        return;
      }
      const nextPath = data.target && data.target.startsWith("/") ? data.target : "/";
      window.location.href = nextPath;
    } catch {
      setError("Network error while signing in.");
      setBusy(false);
    }
  };

  const fieldUnderline =
    "w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none ring-0 transition placeholder:text-neutral-400 focus:border-amber-500 disabled:opacity-50 rounded-none";

  const labelClass = "mb-1 block text-xs font-medium tracking-wide text-blue-950";

  const wordmark = (
    <>
      <span className="text-neutral-900">Continental</span>
      <span className="text-blue-800"> Pension</span>
    </>
  );

  const brandPanelBg =
    "relative bg-gradient-to-br from-blue-950 via-blue-950 to-slate-950 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgb(56_189_248_0.12),transparent_55%)] before:content-['']";

  /** Light surface so the PNG logo (navy/gold) and labels stay readable on the dark brand panel */
  const logoCardClass =
    "flex flex-col items-center gap-3 rounded-2xl border border-blue-200/90 bg-white px-6 py-7 shadow-[0_12px_40px_rgba(0,0,0,0.28)] ring-1 ring-black/5 sm:px-8 sm:py-8";

  const logoMetaHoldings =
    "text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600";
  const logoMetaServices =
    "text-center text-[10px] font-bold uppercase tracking-[0.18em] text-blue-900";
  const logoMetaMalawi = "text-center text-[9px] leading-snug text-slate-600 sm:text-[10px] sm:leading-snug";

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile: brand strip — top of stack */}
      <div className={`flex shrink-0 flex-col items-center justify-center gap-3 py-8 md:hidden ${brandPanelBg}`}>
        <div className={logoCardClass}>
          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
            <Image
              src="/logo.png"
              alt="Continental Holdings"
              width={200}
              height={120}
              className="h-auto w-28 object-contain"
              priority
            />
          </div>
          <span className={logoMetaHoldings}>Continental Holdings</span>
          <span className={logoMetaServices}>Continental Pension Services</span>
          <p className={logoMetaMalawi}>Reserve Bank licensed · Malawi</p>
        </div>
      </div>

      {/* Desktop left — brand / logo */}
      <div className={`hidden min-h-0 flex-1 flex-col items-center justify-center md:flex md:basis-1/2 ${brandPanelBg}`}>
        <div className="relative z-10 flex max-w-md flex-col items-center gap-8 px-8 text-center">
          <div className={logoCardClass}>
            <div className="rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200/80 sm:p-8">
              <Image
                src="/logo.png"
                alt="Continental Holdings"
                width={380}
                height={228}
                className="h-auto w-64 object-contain sm:w-80"
                priority
              />
            </div>
            {/* <span className={`${logoMetaHoldings} text-base`}>Continental Holdings</span> */}
            <span className={`${logoMetaServices} text-base`}>Continental Pension Services</span>
            <span className={`${logoMetaMalawi} text-sm`}>Reserve Bank licensed · Malawi</span>
          </div>

          {/* <div className="flex flex-col items-center gap-0 text-center">
            <span className="block text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              Continental
            </span>
            <span className="block text-4xl font-bold leading-none tracking-tight text-sky-100 sm:text-5xl lg:text-6xl">
              Pension
            </span>
          </div> */}
        </div>
      </div>

      {/* Desktop right — form */}
      <div className="flex flex-1 flex-col justify-center bg-white px-8 py-12 sm:px-12 md:basis-1/2 md:py-16 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <p className="text-2xl font-semibold tracking-tight sm:text-[1.65rem]">{wordmark}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.35em] text-neutral-900">Back office</p>
          </div>

          <h1 className="text-base font-medium text-neutral-800 sm:text-lg">Authorized Access Only</h1>

          {destination !== "/" ? (
            <p className="mt-2 text-xs text-neutral-500">
              After sign-in: <span className="font-mono text-neutral-700">{destination}</span>
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-8 space-y-8" aria-busy={busy}>
            {error ? (
              <div role="alert" className="text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <div>
              <label htmlFor="login-username" className={labelClass}>
                Username
              </label>
              <input
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={fieldUnderline}
                placeholder="username"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                disabled={busy}
              />
            </div>

            <div>
              <label htmlFor="login-password" className={labelClass}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldUnderline}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={busy}
              />
              <div className="mt-2 flex justify-end">
                <a
                  href="#"
                  className="text-xs font-medium text-blue-800 underline-offset-2 hover:text-blue-950 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border border-amber-700/90 bg-gradient-to-b from-amber-400 to-amber-600 py-3.5 text-sm font-bold text-amber-950 shadow-[0_1px_2px_rgb(120_53_15/0.2),0_2px_8px_rgb(120_53_15/0.15)] transition hover:from-amber-300 hover:to-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 disabled:pointer-events-none disabled:opacity-70 ${busy ? "cursor-wait" : ""}`}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-12 text-center text-[11px] text-neutral-500 md:text-left">
            © Continental Pension Services · Malawi
          </p>
        </div>
      </div>
    </div>
  );
}
