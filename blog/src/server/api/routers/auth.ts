import { z } from "zod";
import { LoginResponseSchema } from "~/schemas/auth.schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { LoginResponse } from "~/types/auth";

const API_URL = process.env.AppLift_URL;
const API_KEY = process.env.API_KEY;

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
