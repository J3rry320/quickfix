import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters)."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().default("Phone Repair Quote / Inquiry"),
  area: z.string().trim().optional(),
  message: z.string().trim().min(5, "Please enter a message (at least 5 characters)."),
});

export const quickContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number."),
  area: z.string().trim().optional(),
  message: z.string().trim().optional(),
});
