"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect } from "react";

let registered = false;

export default function ChartSetup() {
  useEffect(() => {
    if (registered) return;
    ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
    registered = true;
  }, []);
  return null;
}
