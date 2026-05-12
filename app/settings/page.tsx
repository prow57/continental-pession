"use client";

import React from "react";

type ThemePref = "light" | "system" | "dark";
type DensityPref = "comfortable" | "compact";
type PageSizePref = "25" | "50" | "100";

export default function SettingsPage() {
  const [theme, setTheme] = React.useState<ThemePref>("light");
  const [density, setDensity] = React.useState<DensityPref>("comfortable");
  const [defaultLanding, setDefaultLanding] = React.useState("/");
  const [pageSize, setPageSize] = React.useState<PageSizePref>("50");
  const [sessionRibbon, setSessionRibbon] = React.useState(true);
  const [navHints, setNavHints] = React.useState(true);
  const [numberGrouping, setNumberGrouping] = React.useState(true);
  const [pdfCover, setPdfCover] = React.useState(true);
  const [pdfLetterhead, setPdfLetterhead] = React.useState(true);
  const [stickyHeaders, setStickyHeaders] = React.useState(true);

  const defaults = React.useCallback(() => {
    setTheme("light");
    setDensity("comfortable");
    setDefaultLanding("/");
    setPageSize("50");
    setSessionRibbon(true);
    setNavHints(true);
    setNumberGrouping(true);
    setPdfCover(true);
    setPdfLetterhead(true);
    setStickyHeaders(true);
  }, []);

  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-cps-950">Settings</h1>
        <p className="text-xs text-slate-600">Appearance, layout, tables, and document output.</p>
      </div>

      <section className="cps-panel overflow-hidden">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Appearance</h2>
            <p className="cps-panel-sub">Theme and visual density for this workstation</p>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-cps-800">Colour theme</label>
            <div className="inline-flex rounded-md border border-cps-300/90 bg-white p-0.5 shadow-sm">
              {(
                [
                  { v: "light" as const, label: "Light" },
                  { v: "system" as const, label: "System" },
                  { v: "dark" as const, label: "Dark" },
                ] as const
              ).map(({ v, label }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTheme(v)}
                  className={`px-3 py-1.5 text-xs font-semibold transition ${theme === v ? "rounded bg-cps-700 text-white shadow-sm" : "rounded text-slate-700 hover:bg-cps-50"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-cps-800">Interface density</label>
            <div className="flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
                <input
                  type="radio"
                  name="density"
                  checked={density === "comfortable"}
                  onChange={() => setDensity("comfortable")}
                  className="h-3.5 w-3.5 border-cps-400 text-cps-600 focus:ring-cps-500"
                />
                Comfortable spacing
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
                <input
                  type="radio"
                  name="density"
                  checked={density === "compact"}
                  onChange={() => setDensity("compact")}
                  className="h-3.5 w-3.5 border-cps-400 text-cps-600 focus:ring-cps-500"
                />
                Compact tables and panels
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="cps-panel overflow-hidden">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Layout & navigation</h2>
            <p className="cps-panel-sub">Where you land after sign-in and chrome behaviour</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <div>
            <label htmlFor="default-landing" className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-cps-800">
              Default home module
            </label>
            <select
              id="default-landing"
              className="cps-input w-full max-w-none sm:max-w-full"
              value={defaultLanding}
              onChange={(e) => setDefaultLanding(e.target.value)}
            >
              <option value="/">Overview</option>
              <option value="/receipts">Receipts</option>
              <option value="/payments">Payments</option>
              <option value="/pension">Pension</option>
              <option value="/finance">Finance</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-500">Opens after each new session on this browser.</p>
          </div>
          <div className="flex flex-col justify-end gap-3">
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={sessionRibbon}
                onChange={() => setSessionRibbon((v) => !v)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-cps-400 text-cps-600 focus:ring-cps-500"
              />
              <span>
                <span className="font-medium">Session ribbon</span>
                <span className="block text-[11px] font-normal text-slate-500">Show signed-in operator strip at the top of the shell.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={navHints}
                onChange={() => setNavHints((v) => !v)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-cps-400 text-cps-600 focus:ring-cps-500"
              />
              <span>
                <span className="font-medium">Section captions</span>
                <span className="block text-[11px] font-normal text-slate-500">Show group headings above sidebar modules.</span>
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="cps-panel overflow-hidden">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">Tables & grids</h2>
            <p className="cps-panel-sub">List and register behaviour</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <div>
            <label htmlFor="page-size" className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-cps-800">
              Default page size
            </label>
            <select
              id="page-size"
              className="cps-input w-full max-w-none sm:max-w-full"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSizePref)}
            >
              <option value="25">25 rows</option>
              <option value="50">50 rows</option>
              <option value="100">100 rows</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-3">
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={stickyHeaders}
                onChange={() => setStickyHeaders((v) => !v)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-cps-400 text-cps-600 focus:ring-cps-500"
              />
              <span>
                <span className="font-medium">Sticky table headers</span>
                <span className="block text-[11px] font-normal text-slate-500">Keep column titles visible while scrolling wide grids.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={numberGrouping}
                onChange={() => setNumberGrouping((v) => !v)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-cps-400 text-cps-600 focus:ring-cps-500"
              />
              <span>
                <span className="font-medium">Thousand separators</span>
                <span className="block text-[11px] font-normal text-slate-500">Format MK amounts with grouping in tables and PDF tables.</span>
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="cps-panel overflow-hidden">
        <div className="cps-panel-hd">
          <div>
            <h2 className="cps-panel-title">PDF & exports</h2>
            <p className="cps-panel-sub">Branded outputs and cover pages</p>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={pdfLetterhead}
              onChange={() => setPdfLetterhead((v) => !v)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-cps-400 text-cps-600 focus:ring-cps-500"
            />
            <span>
              <span className="font-medium">Letterhead block</span>
              <span className="block text-[11px] font-normal text-slate-500">Include logo, fund name, and registration line on every PDF.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={pdfCover}
              onChange={() => setPdfCover((v) => !v)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-cps-400 text-cps-600 focus:ring-cps-500"
            />
            <span>
              <span className="font-medium">Cover sheet</span>
              <span className="block text-[11px] font-normal text-slate-500">Insert a summary cover before multi-page packs.</span>
            </span>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-cps-200/80 pt-2">
        {savedAt ? <span className="text-[11px] text-emerald-800">Saved {savedAt}</span> : null}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="cps-btn text-[11px]" onClick={() => { defaults(); setSavedAt(null); }}>
            Reset to defaults
          </button>
          <button type="button" className="cps-btn-primary text-[11px]" onClick={() => setSavedAt(new Date().toLocaleString("en-MW", { dateStyle: "short", timeStyle: "short" }))}>
            Save layout preferences
          </button>
        </div>
      </div>
    </div>
  );
}
