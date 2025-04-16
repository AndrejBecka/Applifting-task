import { getAccessTokenFromCookies } from "~/lib/auth-cookies";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_AppLift_URL;

export async function GET(req: NextRequest) {
  const token = getAccessTokenFromCookies();
  const imageId = req.nextUrl.searchParams.get("imageId");

  if (!token || !imageId) {
    return NextResponse.json(
      { error: "Unauthorized or missing image ID" },
      { status: 400 },
    );
  }

  const externalRes = await fetch(`${API_URL}/images/${imageId}`, {
    method: "GET",
    headers: {
      Authorization: token,
      "x-api-key": process.env.API_KEY!,
    },
  });

  if (!externalRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 },
    );
  }

  const imageBuffer = await externalRes.arrayBuffer();
  const contentType = externalRes.headers.get("Content-Type") ?? "image/jpeg";

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
