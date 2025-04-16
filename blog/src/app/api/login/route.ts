// app/api/login/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: Request) {
  const { access_token } = (await req.json()) as { access_token: string };

  return new NextResponse("OK", {
    status: 200,
    headers: {
      "Set-Cookie": serialize("access_token", access_token, {
        httpOnly: true,
        path: "/",
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      }),
    },
  });
}
