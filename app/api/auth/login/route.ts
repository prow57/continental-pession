import { NextResponse } from "next/server";

type Body = {
  username?: string;
  password?: string;
  from?: string;
};

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }

  const username = (body.username ?? "").trim();
  const password = (body.password ?? "").trim();
  const from = (body.from ?? "/").trim();

  if (!username || !password) {
    return NextResponse.json({ status: 0, message: "Username and password are required." }, { status: 400 });
  }

  const target = from.startsWith("/") ? from : "/";
  const response = NextResponse.json({ status: 1, target });

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 12);

  response.cookies.set({
    name: "cps_session",
    value: "1",
    path: "/",
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
  });
  response.cookies.set({
    name: "cps_user",
    value: encodeURIComponent(username || "Operator"),
    path: "/",
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
  });

  return response;
}
