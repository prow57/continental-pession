"use client";

import type { ReactNode } from "react";
import { useId } from "react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Optional filters / selects shown before the search field */
  leading?: ReactNode;
  /** Optional right-side controls — kept on one row beside search when space allows */
  actions?: ReactNode;
  /** Stable id for accessibility (avoids duplicate ids when multiple toolbars exist) */
  inputId?: string;
  /** Hide search (e.g. toolbar is actions-only) */
  hideSearch?: boolean;
};

export function DataToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  leading,
  actions,
  inputId: inputIdProp,
  hideSearch = false,
}: Props) {
  const autoId = useId();
  const inputId = inputIdProp ?? `cps-search-${autoId.replace(/:/g, "")}`;

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-3 sm:gap-y-2">
      <div className="flex min-w-0 w-full flex-wrap items-center gap-2 sm:flex-1 sm:w-auto">
        {leading}
        {!hideSearch ? (
          <>
            <label className="sr-only" htmlFor={inputId}>
              Search table
            </label>
            <input
              id={inputId}
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="cps-input min-w-0 flex-1 basis-[10rem] sm:max-w-[min(100%,20rem)]"
              autoComplete="off"
            />
          </>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full min-w-0 shrink-0 flex-row flex-nowrap items-center justify-end gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:w-auto [&::-webkit-scrollbar]:hidden">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
