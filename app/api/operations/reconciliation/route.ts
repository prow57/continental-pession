import { NextResponse } from "next/server";
import { dummyReconciliationBatches } from "@/data";

export async function GET() {
  return NextResponse.json({ status: 1, data: dummyReconciliationBatches });
}
