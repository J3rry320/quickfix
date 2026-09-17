import { z } from "zod";

export const stageDeviceSchema = z.object({
  brand: z.string().trim().min(1, "Please select your phone brand."),
  model: z.string().trim().min(1, "Please select or enter your device model."),
});

export const stageServiceSchema = z.object({
  issueDescription: z.string().trim().min(1, "Please select the repair service or issue needed."),
  additionalNotes: z.string().trim().optional(),
});

export const stageConfirmSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters)."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number."),
  streetAddress: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true; // Optional!
        if (val.length < 3) return false;
        // If a 6-digit pincode is entered in the address, verify it starts with 411
        const pincodeMatch = val.match(/\b\d{6}\b/);
        if (pincodeMatch && !pincodeMatch[0].startsWith("411")) {
          return false;
        }
        return true;
      },
      {
        message: "We only provide doorstep pickup across Pune (Pincode must start with 411).",
      }
    ),
  area: z.string().trim().optional(),
  pincode: z.string().trim().optional(),
  date: z.string().min(1, "Please select your preferred repair date."),
  timeSlot: z.string().min(1, "Please select your preferred time slot."),
});

export const fullBookingSchema = stageDeviceSchema
  .merge(stageServiceSchema)
  .merge(stageConfirmSchema);

export type BookingFieldErrors = Record<string, string>;

/**
 * Utility to extract clean, field-keyed error messages from Zod issues without clutter.
 */
export function formatZodIssues(issues: z.ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[issue.path.length - 1] as string;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
