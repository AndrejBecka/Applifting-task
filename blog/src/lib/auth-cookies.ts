import { cookies } from "next/headers";

export function getAccessTokenFromCookies(): string | null {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  return token ?? null;
}
