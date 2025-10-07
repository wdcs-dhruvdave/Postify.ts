import { z } from "zod";
import { VALIDATION } from "@/constants/index";

export const signupFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(
      VALIDATION.USERNAME.MIN_LENGTH,
      VALIDATION.USERNAME.MESSAGES.MIN_LENGTH,
    )
    .max(
      VALIDATION.USERNAME.MAX_LENGTH,
      VALIDATION.USERNAME.MESSAGES.MAX_LENGTH,
    )
    .regex(VALIDATION.USERNAME.PATTERN, VALIDATION.USERNAME.MESSAGES.PATTERN),

  email: z
    .string()
    .trim()
    .email(VALIDATION.EMAIL.MESSAGES.INVALID)
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .min(
      VALIDATION.PASSWORD.MIN_LENGTH,
      VALIDATION.PASSWORD.MESSAGES.MIN_LENGTH,
    )
    .max(
      VALIDATION.PASSWORD.MAX_LENGTH,
      VALIDATION.PASSWORD.MESSAGES.MAX_LENGTH,
    ),

  name: z
    .string()
    .min(VALIDATION.NAME.MIN_LENGTH, VALIDATION.NAME.MESSAGES.MIN_LENGTH)
    .max(VALIDATION.NAME.MAX_LENGTH, VALIDATION.NAME.MESSAGES.MAX_LENGTH)
    .trim()
    .optional(),
});

export type RegisterForm = z.infer<typeof signupFormSchema>;
