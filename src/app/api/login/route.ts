import { NextResponse } from "next/server";
import { isValidPassword, passwordEnabled, SESSION_COOKIE, sessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  if (!passwordEnabled()) {
    return NextResponse.json({ ok: true });
  }
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!isValidPassword(body?.password || "")) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return response;
}
