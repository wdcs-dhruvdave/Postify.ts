
import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .min(6, 'Password is required')
    .max(20, 'Password must be at most 20 characters')
    .trim(),

  rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
