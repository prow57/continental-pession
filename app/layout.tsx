import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import AppShell from "@/components/AppShell";
import ChartSetup from "@/components/ChartSetup";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CPS Back Office | Continental Pension Services",
  description: "Continental Pension Services — pension administration back office (Malawi).",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <ChartSetup />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
