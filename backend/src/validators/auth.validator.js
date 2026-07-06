const { z } = require('zod');

const signupSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password too short"),
    name: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password required")
});

module.exports = { signupSchema, loginSchema };