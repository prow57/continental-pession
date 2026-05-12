import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Appearance, layout, tables, and document output preferences.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
