import { NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "~/lib/auth-cookies";

const API_URL = process.env.NEXT_PUBLIC_AppLift_URL;

export async function POST(req: Request) {
  const token = getAccessTokenFromCookies();
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("image") as File;

  const uploadRes = await fetch(`${API_URL}/images`, {
    method: "POST",
    headers: {
      Authorization: token,
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: (() => {
      const formData = new FormData();
      formData.append("image", file);
      return formData;
    })(),
  });

  const data = (await uploadRes.json()) as { imageId: string; name: string };
  return NextResponse.json(data, { status: uploadRes.status });
}
