import { verifyPasswordStrength } from '@common/utils/password'
import { z } from 'zod'

export const SignUpSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: 'Username must contain at least 3 characters' })
      .max(32, { message: 'Username must contain at most 32 characters' }),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(async (data) => await verifyPasswordStrength(data.password), {
    message: 'Password is too weak',
    path: ['password'],
  })

export const SignInSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: 'Username must contain at least 3 characters' })
    .max(32, { message: 'Username must contain at most 32 characters' }),
  password: z.string(),
})
