import { NextResponse } from "next/server";
import { dummyPostingQueue } from "@/data";

export async function GET() {
  return NextResponse.json({ status: 1, data: dummyPostingQueue });
}
