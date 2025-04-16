import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Set the cookie to expire immediately
  const logoutCookie = serialize("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return new NextResponse("Logged out", {
    status: 200,
    headers: {
      "Set-Cookie": logoutCookie,
    },
  });
}
