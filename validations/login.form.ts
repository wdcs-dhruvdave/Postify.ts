import { z } from "zod";
import { VALIDATION } from "@/constants/index";

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email(VALIDATION.EMAIL.MESSAGES.INVALID)
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .min(VALIDATION.PASSWORD.MIN_LENGTH, VALIDATION.PASSWORD.MESSAGES.REQUIRED)
    .max(
      VALIDATION.PASSWORD.MAX_LENGTH,
      VALIDATION.PASSWORD.MESSAGES.MAX_LENGTH,
    )
    .trim(),

  rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
