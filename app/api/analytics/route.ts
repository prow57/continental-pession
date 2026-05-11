import { NextResponse } from "next/server";
import { computeAnalytics } from "@/lib/computeAnalytics";

export async function GET() {
  return NextResponse.json({
    status: 1,
    data: computeAnalytics(),
  });
}
