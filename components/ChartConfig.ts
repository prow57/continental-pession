import type { ChartOptions } from "chart.js";

/** CPS palette — richer greens; `alpha` 0–1 */
export function cpsColor(shade: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, alpha = 1): string {
  const map: Record<number, string> = {
    100: "212, 232, 222",
    200: "168, 207, 186",
    300: "116, 176, 142",
    400: "63, 143, 104",
    500: "38, 115, 82",
    600: "28, 92, 65",
    700: "23, 74, 54",
    800: "18, 60, 44",
    900: "14, 48, 36",
  };
  const rgb = map[shade] ?? map[500];
  return `rgba(${rgb}, ${alpha})`;
}

export const defaultOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(11, 18, 32, 0.94)",
      borderColor: "rgba(245, 158, 11, 0.35)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
      titleColor: "#fde68a",
      bodyColor: "#e2e8f0",
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#475569", font: { size: 11, weight: 500 } },
    },
    y: {
      border: { display: false },
      grid: { color: "rgba(100, 116, 139, 0.2)" },
      ticks: { color: "#475569", font: { size: 11, weight: 500 } },
    },
  },
};
