import { jsPDF } from "jspdf";
import { downloadCsv, toCsv } from "@/lib/csv";

/** Sidebar-aligned navy + accent orange (Continental / CPS palette). */
const BRAND = {
  navy: [23, 37, 84] as [number, number, number],
  navyDark: [15, 23, 42] as [number, number, number],
  orange: [234, 88, 12] as [number, number, number],
  orangeLight: [251, 191, 36] as [number, number, number],
  text: [11, 18, 32] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  sky: [186, 211, 233] as [number, number, number],
};

const HEADER_H = 96;
const ACCENT_H = 4;
const MARGIN = 40;
const LOGO_BOX = 58;

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/logo.png", { cache: "force-cache" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(typeof r.result === "string" ? r.result : null);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawHeader(doc: jsPDF, pageW: number, title: string, logoDataUrl: string | null) {
  doc.setFillColor(...BRAND.navy);
  doc.rect(0, 0, pageW, HEADER_H, "F");
  doc.setFillColor(...BRAND.orange);
  doc.rect(0, HEADER_H, pageW, ACCENT_H, "F");

  const textX = logoDataUrl ? MARGIN + LOGO_BOX + 14 : MARGIN;
  const textMaxW = pageW - textX - MARGIN;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", MARGIN, 18, LOGO_BOX, LOGO_BOX);
    } catch {
      /* ignore corrupt image */
    }
  }

  doc.setTextColor(...BRAND.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  const titleLines = doc.splitTextToSize(title, textMaxW) as string[];
  let ty = 36;
  for (const ln of titleLines.slice(0, 3)) {
    doc.text(ln, textX, ty);
    ty += 18;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.sky);
  doc.text("Continental Pension Services", textX, Math.max(ty + 4, 58));

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...BRAND.orangeLight);
  doc.text("CONTINENTAL HOLDINGS", textX, Math.max(ty + 20, 76));
}

function drawFooter(doc: jsPDF, pageW: number, pageH: number, pageNum: number) {
  const yLine = pageH - 38;
  doc.setDrawColor(...BRAND.orange);
  doc.setLineWidth(1);
  doc.line(MARGIN, yLine, pageW - MARGIN, yLine);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text("Continental Pension Services · Reserve Bank licensed · Malawi", pageW / 2, pageH - 24, { align: "center" });
  doc.text(`Page ${pageNum}`, pageW - MARGIN, pageH - 24, { align: "right" });
}

/**
 * Branded A4 PDF: navy header band, orange rule, logo, typography aligned with the app shell.
 */
export async function downloadBrandedPdfDocument(title: string, bodyLines: string[]): Promise<void> {
  const logoDataUrl = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxWidth = pageW - MARGIN * 2;
  let pageNum = 1;
  let y = HEADER_H + ACCENT_H + 24;

  drawHeader(doc, pageW, title, logoDataUrl);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.text);

  for (const line of bodyLines) {
    const chunks = doc.splitTextToSize(line, maxWidth);
    for (const chunk of chunks) {
      if (y > pageH - 72) {
        drawFooter(doc, pageW, pageH, pageNum);
        doc.addPage();
        pageNum += 1;
        drawHeader(doc, pageW, title, logoDataUrl);
        y = HEADER_H + ACCENT_H + 24;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...BRAND.text);
      }
      doc.text(chunk, MARGIN, y);
      y += 14;
    }
  }

  drawFooter(doc, pageW, pageH, pageNum);

  const safe = title.replace(/[^\w\-]+/g, "_").slice(0, 48);
  doc.save(`${safe}.pdf`);
}

export function downloadTableCsv(
  filename: string,
  rows: Record<string, string | number | boolean | null | undefined>[],
  columns: { key: string; header: string }[],
): void {
  const stamp = new Date().toLocaleString("en-MW");
  const lead = `"Continental Pension Services"\n"Reserve Bank licensed · Malawi · ${stamp}"\n\n`;
  downloadCsv(filename, lead + toCsv(rows, columns));
}
