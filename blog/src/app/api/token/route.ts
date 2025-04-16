import { getAccessTokenFromCookies } from "~/lib/auth-cookies";
import { NextResponse } from "next/server";

export async function GET() {
  const token = getAccessTokenFromCookies();

  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 200 });
  }

  return NextResponse.json({ isLoggedIn: true });
}
