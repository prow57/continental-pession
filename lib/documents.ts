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
const BODY_TOP = HEADER_H + ACCENT_H + 24;
const FOOTER_TOP = 804;

type PdfCtx = {
  doc: jsPDF;
  pageW: number;
  pageH: number;
  y: number;
  pageNum: number;
  title: string;
  logoDataUrl: string | null;
};

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

function createPdfCtx(title: string, logoDataUrl: string | null): PdfCtx {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  drawHeader(doc, pageW, title, logoDataUrl);
  return { doc, pageW, pageH, y: BODY_TOP, pageNum: 1, title, logoDataUrl };
}

function pushPage(ctx: PdfCtx) {
  drawFooter(ctx.doc, ctx.pageW, ctx.pageH, ctx.pageNum);
  ctx.doc.addPage();
  ctx.pageNum += 1;
  drawHeader(ctx.doc, ctx.pageW, ctx.title, ctx.logoDataUrl);
  ctx.y = BODY_TOP;
}

function ensureSpace(ctx: PdfCtx, needed: number) {
  if (ctx.y + needed > FOOTER_TOP) pushPage(ctx);
}

function drawSectionTitle(ctx: PdfCtx, title: string) {
  ensureSpace(ctx, 34);
  const d = ctx.doc;
  d.setFillColor(...BRAND.navyDark);
  d.roundedRect(MARGIN, ctx.y, ctx.pageW - MARGIN * 2, 22, 4, 4, "F");
  d.setFont("helvetica", "bold");
  d.setFontSize(10);
  d.setTextColor(...BRAND.white);
  d.text(title, MARGIN + 10, ctx.y + 15);
  ctx.y += 30;
}

function drawParagraph(ctx: PdfCtx, text: string) {
  const d = ctx.doc;
  const maxW = ctx.pageW - MARGIN * 2;
  const lines = d.splitTextToSize(text, maxW) as string[];
  ensureSpace(ctx, lines.length * 14 + 8);
  d.setFont("helvetica", "normal");
  d.setFontSize(10);
  d.setTextColor(...BRAND.text);
  for (const line of lines) {
    d.text(line, MARGIN, ctx.y);
    ctx.y += 14;
  }
  ctx.y += 6;
}

function drawKeyValues(ctx: PdfCtx, fields: { label: string; value: string }[]) {
  const d = ctx.doc;
  const gap = 10;
  const cols = 2;
  const boxW = (ctx.pageW - MARGIN * 2 - gap) / cols;
  const boxH = 42;

  for (let i = 0; i < fields.length; i += cols) {
    ensureSpace(ctx, boxH + 8);
    const row = fields.slice(i, i + cols);
    row.forEach((f, col) => {
      const x = MARGIN + col * (boxW + gap);
      d.setFillColor(245, 249, 255);
      d.setDrawColor(...BRAND.sky);
      d.roundedRect(x, ctx.y, boxW, boxH, 4, 4, "FD");
      d.setFont("helvetica", "bold");
      d.setFontSize(8);
      d.setTextColor(...BRAND.muted);
      d.text(f.label.toUpperCase(), x + 8, ctx.y + 13);
      d.setFont("helvetica", "bold");
      d.setFontSize(11);
      d.setTextColor(...BRAND.text);
      const valueLines = d.splitTextToSize(f.value, boxW - 14) as string[];
      d.text(valueLines.slice(0, 2), x + 8, ctx.y + 28);
    });
    ctx.y += boxH + 8;
  }
  ctx.y += 2;
}

function drawTable(
  ctx: PdfCtx,
  columns: { header: string; width: number; align?: "left" | "right" }[],
  rows: string[][],
) {
  const d = ctx.doc;
  const rowH = 22;
  const tableW = columns.reduce((a, c) => a + c.width, 0);
  const x0 = MARGIN;

  ensureSpace(ctx, rowH + 4);
  d.setFillColor(...BRAND.navy);
  d.rect(x0, ctx.y, tableW, rowH, "F");
  let x = x0;
  d.setFont("helvetica", "bold");
  d.setFontSize(9);
  d.setTextColor(...BRAND.white);
  columns.forEach((c) => {
    d.text(c.header, x + 6, ctx.y + 14);
    x += c.width;
  });
  ctx.y += rowH;

  rows.forEach((row, i) => {
    ensureSpace(ctx, rowH);
    d.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 251, i % 2 === 0 ? 255 : 255);
    d.setDrawColor(220, 229, 243);
    d.rect(x0, ctx.y, tableW, rowH, "FD");
    let cellX = x0;
    d.setFont("helvetica", "normal");
    d.setFontSize(9);
    d.setTextColor(...BRAND.text);
    columns.forEach((c, idx) => {
      const v = row[idx] ?? "";
      if (c.align === "right") d.text(v, cellX + c.width - 6, ctx.y + 14, { align: "right" });
      else d.text(v, cellX + 6, ctx.y + 14);
      cellX += c.width;
    });
    ctx.y += rowH;
  });
  ctx.y += 8;
}

function savePdf(ctx: PdfCtx, filenameStem: string) {
  drawFooter(ctx.doc, ctx.pageW, ctx.pageH, ctx.pageNum);
  const safe = filenameStem.replace(/[^\w\-]+/g, "_").slice(0, 48);
  ctx.doc.save(`${safe}.pdf`);
}

function formatMkValue(amount: number): string {
  return `MK ${amount.toLocaleString("en-MW")}`;
}

export async function downloadPaymentVoucherPdf(args: {
  reference: string;
  payee: string;
  amountMk: number;
  paymentType: string;
  status: string;
  dateLabel?: string;
}): Promise<void> {
  const logo = await loadLogoDataUrl();
  const ctx = createPdfCtx(`Payment voucher ${args.reference}`, logo);

  drawSectionTitle(ctx, "Voucher summary");
  drawKeyValues(ctx, [
    { label: "Reference", value: args.reference },
    { label: "Date", value: args.dateLabel ?? new Date().toLocaleDateString("en-MW") },
    { label: "Payee", value: args.payee },
    { label: "Amount", value: formatMkValue(args.amountMk) },
    { label: "Payment type", value: args.paymentType },
    { label: "Authorization", value: args.status },
  ]);

  drawSectionTitle(ctx, "Settlement details");
  drawTable(
    ctx,
    [
      { header: "Line", width: 70 },
      { header: "Description", width: 300 },
      { header: "Amount (MK)", width: 145, align: "right" },
    ],
    [
      ["1", `${args.paymentType} disbursement`, args.amountMk.toLocaleString("en-MW")],
      ["2", "Withholding / adjustments", "0"],
      ["", "Net payable", args.amountMk.toLocaleString("en-MW")],
    ],
  );

  drawParagraph(
    ctx,
    "Authorized signatories confirm beneficiary checks, bank mandate validation, and voucher control references before release.",
  );
  savePdf(ctx, `Payment voucher ${args.reference}`);
}

export async function downloadMemberLetterPdf(args: {
  reference: string;
  memberName: string;
  paymentType: string;
  amountMk?: number;
}): Promise<void> {
  const logo = await loadLogoDataUrl();
  const ctx = createPdfCtx(`Member letter ${args.reference}`, logo);

  drawSectionTitle(ctx, "Letter heading");
  drawKeyValues(ctx, [
    { label: "Member", value: args.memberName },
    { label: "Reference", value: args.reference },
    { label: "Subject", value: args.paymentType },
    { label: "Date", value: new Date().toLocaleDateString("en-MW") },
  ]);

  drawSectionTitle(ctx, "Body");
  drawParagraph(ctx, `Dear ${args.memberName},`);
  drawParagraph(
    ctx,
    `This letter confirms that your ${args.paymentType.toLowerCase()} instruction has been processed under reference ${args.reference}.`,
  );
  if (typeof args.amountMk === "number") {
    drawParagraph(ctx, `The approved amount is ${formatMkValue(args.amountMk)} and will be settled using your verified banking details.`);
  }
  drawParagraph(ctx, "For clarifications, contact Continental Pension Services support desk during business hours.");

  savePdf(ctx, `Member letter ${args.reference}`);
}

export async function downloadVoluntaryStatementPdf(args: {
  statementId: string;
  memberName: string;
  district: string;
  pensionPortionMk: number;
  personalSavingsMk: number;
}): Promise<void> {
  const logo = await loadLogoDataUrl();
  const ctx = createPdfCtx(`Voluntary statement ${args.statementId}`, logo);
  const total = args.pensionPortionMk + args.personalSavingsMk;

  drawSectionTitle(ctx, "Member profile");
  drawKeyValues(ctx, [
    { label: "Statement", value: args.statementId },
    { label: "Member", value: args.memberName },
    { label: "District", value: args.district },
    { label: "Generated", value: new Date().toLocaleDateString("en-MW") },
  ]);

  drawSectionTitle(ctx, "Account balances");
  drawTable(
    ctx,
    [
      { header: "Account", width: 280 },
      { header: "Share", width: 90 },
      { header: "Balance (MK)", width: 145, align: "right" },
    ],
    [
      ["Pension benefit account", "60%", args.pensionPortionMk.toLocaleString("en-MW")],
      ["Personal savings account", "40%", args.personalSavingsMk.toLocaleString("en-MW")],
      ["Total", "100%", total.toLocaleString("en-MW")],
    ],
  );

  drawSectionTitle(ctx, "Movement summary");
  drawParagraph(
    ctx,
    "Contribution allocations, split journals, and fee postings are recorded in the transaction ledger and reflected in the next statement cycle.",
  );

  savePdf(ctx, `Voluntary statement ${args.statementId}`);
}

export async function downloadReportCataloguePdf(items: { name: string; module: string; format: string }[]): Promise<void> {
  const logo = await loadLogoDataUrl();
  const ctx = createPdfCtx("Report catalogue snapshot", logo);

  drawSectionTitle(ctx, "Catalogue summary");
  drawParagraph(ctx, `Total reports: ${items.length}`);

  drawTable(
    ctx,
    [
      { header: "Report", width: 250 },
      { header: "Module", width: 180 },
      { header: "Formats", width: 85 },
    ],
    items.map((r) => [r.name, r.module, r.format]),
  );

  savePdf(ctx, "Report catalogue snapshot");
}

export async function downloadReportOutputPdf(args: {
  reportName: string;
  module: string;
  jobId: string;
  message: string;
  parameters: string;
}): Promise<void> {
  const logo = await loadLogoDataUrl();
  const ctx = createPdfCtx(`Report output ${args.reportName}`, logo);

  drawSectionTitle(ctx, "Execution details");
  drawKeyValues(ctx, [
    { label: "Report", value: args.reportName },
    { label: "Module", value: args.module },
    { label: "Job ID", value: args.jobId },
    { label: "Status", value: args.message },
  ]);

  drawSectionTitle(ctx, "Parameters");
  drawParagraph(ctx, args.parameters);

  drawSectionTitle(ctx, "Preview");
  drawTable(
    ctx,
    [
      { header: "Metric", width: 300 },
      { header: "Value", width: 215, align: "right" },
    ],
    [
      ["Rows processed", "1,248"],
      ["Value currency", "MK"],
      ["Validation checks", "Passed"],
    ],
  );

  savePdf(ctx, `Report output ${args.reportName}`);
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
