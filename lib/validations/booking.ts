import { z } from "zod";
import { getIstDateString, getIstMinutesFromMidnight, CUTOFFS } from "@/lib/date";

export const stageDeviceSchema = z.object({
  brand: z
    .string()
    .trim()
    .min(1, "Please select your phone brand.")
    .max(60, "Brand name is too long."),
  model: z
    .string()
    .trim()
    .min(1, "Please select or enter your device model.")
    .max(80, "Model name is too long."),
});

export const stageServiceSchema = z.object({
  issueDescription: z
    .string()
    .trim()
    .min(1, "Please select the repair service or issue needed.")
    .max(500, "Issue description is too long (maximum 500 characters)."),
  additionalNotes: z
    .string()
    .trim()
    .max(1000, "Additional notes cannot exceed 1000 characters.")
    .optional(),
});

export const stageConfirmBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters).")
    .max(100, "Name cannot exceed 100 characters.")
    .regex(/^[a-zA-Z\s.'-]+$/, "Please enter a valid name containing letters and spaces only."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number."),
  streetAddress: z
    .string()
    .trim()
    .max(200, "Address cannot exceed 200 characters.")
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true; // Optional doorstep address
        if (val.length < 3) return false;
        // If a 6-digit pincode is entered in the address string, verify it starts with 411
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
  area: z
    .string()
    .trim()
    .max(100, "Area name cannot exceed 100 characters.")
    .optional(),
  pincode: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true;
        return /^411\d{3}$/.test(val);
      },
      {
        message: "Please enter a valid 6-digit Pune pincode starting with 411 (e.g. 411030).",
      }
    ),
  date: z
    .string()
    .trim()
    .min(1, "Please select your preferred repair date.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected YYYY-MM-DD.")
    .refine(
      (val) => {
        const d = new Date(val);
        return !isNaN(d.getTime());
      },
      { message: "Please provide a valid calendar date." }
    )
    .refine(
      (val) => {
        const todayIst = getIstDateString(0);
        return val >= todayIst;
      },
      { message: "Booking date cannot be in the past." }
    )
    .refine(
      (val) => {
        const maxIst = getIstDateString(30);
        return val <= maxIst;
      },
      { message: "Booking date cannot be more than 30 days in advance." }
    ),
  timeSlot: z
    .string()
    .trim()
    .min(3, "Please select your preferred time slot.")
    .max(100, "Time slot description is too long."),
});

/**
 * Super-refinement for date and timeSlot slot availability based on IST operating hours.
 */
function refineDateTimeSlot(
  data: { date: string; timeSlot: string },
  ctx: z.RefinementCtx
) {
  const todayIst = getIstDateString(0);
  const istMinutes = getIstMinutesFromMidnight();

  if (data.date === todayIst) {
    if (istMinutes > CUTOFFS.EXPRESS_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date"],
        message: "Bookings for today are closed (operating cutoff is 8:15 PM). Please select tomorrow or a future date.",
      });
      return;
    }

    const slotLower = data.timeSlot.toLowerCase();
    if (slotLower.includes("morning") && istMinutes >= CUTOFFS.MORNING_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["timeSlot"],
        message: "The Morning slot has already passed for today. Please select another slot.",
      });
    } else if (slotLower.includes("afternoon") && istMinutes >= CUTOFFS.AFTERNOON_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["timeSlot"],
        message: "The Afternoon slot has already passed for today. Please select Evening or tomorrow.",
      });
    } else if (slotLower.includes("evening") && istMinutes >= CUTOFFS.EVENING_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["timeSlot"],
        message: "The Evening slot has already passed for today. Please select tomorrow.",
      });
    } else if (slotLower.includes("express") && istMinutes > CUTOFFS.EXPRESS_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["timeSlot"],
        message: "Express dispatch is closed for today. Please select tomorrow morning.",
      });
    }
  }
}

export const stageConfirmSchema = stageConfirmBaseSchema.superRefine(refineDateTimeSlot);

export const fullBookingSchema = stageDeviceSchema
  .merge(stageServiceSchema)
  .merge(stageConfirmBaseSchema)
  .superRefine(refineDateTimeSlot);

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
