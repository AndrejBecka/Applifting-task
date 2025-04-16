import { getAccessTokenFromCookies } from "~/lib/auth-cookies";

export async function createContext() {
  const accessToken = getAccessTokenFromCookies();

  return {
    accessToken,
    apiKey: process.env.API_KEY!,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
