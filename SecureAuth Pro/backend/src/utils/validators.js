const { z } = require('zod')

const passwordPolicy = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72)

const emailSchema = z.string().email('Invalid email')

const registerSchema = z.object({
  email: emailSchema,
  password: passwordPolicy
})

const loginSchema = z.object({
  email: emailSchema,
  password: passwordPolicy
})

const forgotPasswordSchema = z.object({
  email: emailSchema
})

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: passwordPolicy
})

const verifyEmailSchema = z.object({
  token: z.string().min(10)
})

const profileSchema = z.object({
  // Mock profile fields for portfolio
  // Could be extended to name, avatar, etc.
  displayName: z.string().min(2).max(60).optional().default('User')
})

const changePasswordSchema = z.object({
  currentPassword: passwordPolicy,
  newPassword: passwordPolicy
})

const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'user'])
})

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  profileSchema,
  changePasswordSchema,
  updateUserRoleSchema
}

