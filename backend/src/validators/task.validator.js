const { z } = require('zod');

const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    dueDate: z.string().datetime("Due date must be a valid date").refine(date => new Date(date) > new Date(), "Due date must be in the future"),
    status: z.enum(["pending", "in-progress", "completed"]).default("pending")
});

const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional()
});

module.exports = { createTaskSchema, updateTaskSchema };