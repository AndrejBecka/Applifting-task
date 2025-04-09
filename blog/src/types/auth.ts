import type { LoginResponseSchema } from "~/schemas/auth.schema";
import type { z } from "zod";

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
