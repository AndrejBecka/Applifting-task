import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const API_URL = process.env.AppLift_URL;
const API_KEY = process.env.API_KEY;

const LoginResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});

type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(3),
      }),
    )
    .mutation(async ({ input }): Promise<LoginResponse> => {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY ?? "",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const error = (await res.json()) as unknown;
        const errorMessage =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Login failed";
        throw new Error(errorMessage);
      }

      const data = (await res.json()) as unknown;
      const validatedData = LoginResponseSchema.parse(data);

      // Optionally: Store token in a cookie/session here

      return validatedData;
    }),
});
