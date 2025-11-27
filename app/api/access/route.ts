import { NextResponse } from "next/server";

const COOKIE_NAME = "early-access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request) {
  const { password } = await request.json();

  const correctPassword = process.env.EARLY_ACCESS_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Early access not configured" },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
