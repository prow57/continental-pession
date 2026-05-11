import { NextResponse } from "next/server";

type Body = { reportName?: string; format?: string; module?: string };

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }
  const jobId = `RPT-${Date.now().toString(36).toUpperCase()}`;
  return NextResponse.json({
    status: 1,
    jobId,
    message: `Report “${body.reportName ?? "Untitled"}” queued (${body.format ?? "PDF"})`,
  });
}
