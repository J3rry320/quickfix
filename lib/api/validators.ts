import { z } from "zod";
import { RepairRequest } from "@/models/RepairRequest";
import {
  getIstDateString,
  parseIstDateMidday,
  getIstMinutesFromMidnight,
  CUTOFFS,
} from "@/lib/date";

/**
 * Utility to generate URL-safe slugs from strings
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

/**
 * Generates formatted booking reference: QF-YYMM-XXXXX
 * Uses unambiguous characters (excluding 0, O, 1, I).
 */
export function generateBookingReference(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `QF-${yy}${mm}-${randomPart}`;
}

/**
 * Ensures generated booking reference is unique in the database
 */
export async function getUniqueBookingReference(): Promise<string> {
  let attempts = 0;
  while (attempts < 10) {
    const ref = generateBookingReference();
    const exists = await RepairRequest.exists({ bookingReference: ref });
    if (!exists) {
      return ref;
    }
    attempts++;
  }
  // Fallback timestamp suffix if extreme collision occurs
  return `QF-${Date.now().toString(36).toUpperCase()}`;
}

// -------------------------------------------------------------
// 1. REPAIR SERVICES VALIDATION
// -------------------------------------------------------------

export const createServiceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters").trim(),
  slug: z.string().min(2).trim().optional(),
  description: z.string().min(10, "Description must be at least 10 characters").trim(),
  estimatedTimeMinutes: z.coerce.number().min(5).default(30),
  startingPrice: z.coerce.number().min(0, "Starting price must be non-negative"),
  warrantyDays: z.coerce.number().min(0).default(90),
  icon: z.string().optional(),
  image: z.string().optional(),
  isPopular: z.boolean().default(false),
  commonIssues: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

// -------------------------------------------------------------
// 2. BRANDS VALIDATION
// -------------------------------------------------------------

export const createBrandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters").trim(),
  slug: z.string().min(2).trim().optional(),
  logoUrl: z.string().optional(),
  isPopular: z.boolean().default(false),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export const updateBrandSchema = createBrandSchema.partial();

// -------------------------------------------------------------
// 3. DEVICE MODELS VALIDATION
// -------------------------------------------------------------

export const modelServicePriceSchema = z.object({
  service: z.string().min(1, "Service ID is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  estimatedTimeMinutes: z.coerce.number().min(5).optional(),
});

export const createModelSchema = z.object({
  brand: z.string().min(1, "Brand ID is required"),
  name: z.string().min(2, "Model name must be at least 2 characters").trim(),
  slug: z.string().min(2).trim().optional(),
  releaseYear: z.coerce.number().min(2000).max(2100).optional(),
  imageUrl: z.string().optional(),
  isPopular: z.boolean().default(false),
  servicePricing: z.array(modelServicePriceSchema).default([]),
  isActive: z.boolean().default(true),
});

export const updateModelSchema = createModelSchema.partial();

// -------------------------------------------------------------
// 4. BLOG POSTS VALIDATION
// -------------------------------------------------------------

export const blogAuthorSchema = z.object({
  name: z.string().default("QuickFix Tech Team"),
  role: z.string().default("Smartphone Specialist"),
  avatar: z.string().optional(),
});

export const blogSeoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).default([]),
});

export const createBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").trim(),
  slug: z.string().min(3).trim().optional(),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").trim(),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().optional(),
  author: blogAuthorSchema.optional(),
  category: z.string().min(2, "Category is required").trim(),
  tags: z.array(z.string()).default([]),
  language: z.enum(["en", "hi", "mr"]).default("en"),
  readingTimeMinutes: z.coerce.number().min(1).default(4),
  seo: blogSeoSchema.optional(),
  isPublished: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

// -------------------------------------------------------------
// 5. CONTACT SUBMISSIONS VALIDATION
// -------------------------------------------------------------

export const createContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  subject: z.string().trim().default("General Inquiry"),
  message: z.string().min(5, "Message must be at least 5 characters").trim(),
  area: z.string().trim().optional(),
  source: z.string().default("contact_page"),
  locale: z.enum(["en", "hi", "mr"]).default("en"),
});

export const updateContactStatusSchema = z.object({
  status: z
    .enum(["new", "in_progress", "contacted", "resolved", "archived"])
    .optional(),
  internalNotes: z.string().optional(),
});

// -------------------------------------------------------------
// 6. REPAIR REQUESTS VALIDATION
// -------------------------------------------------------------

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Customer name should contain only valid letters"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export const deviceSchema = z.object({
  brand: z
    .string()
    .trim()
    .min(1, "Device brand is required")
    .max(60, "Brand name is too long"),
  model: z
    .string()
    .trim()
    .min(1, "Device model is required")
    .max(80, "Model name is too long"),
  color: z.string().trim().max(40).optional(),
});

export const addressSchema = z.object({
  area: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default("Pune")
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : "Pune")),
  streetAddress: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default("To be confirmed via phone call")
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : "To be confirmed via phone call")),
  pincode: z
    .string()
    .trim()
    .optional()
    .default("411030")
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : "411030"))
    .refine((val) => /^411\d{3}$/.test(val), {
      message: "Please provide a valid 6-digit Pune pincode starting with 411 (e.g. 411030)",
    }),
  landmark: z.string().trim().max(100).optional(),
  city: z.string().trim().default("Pune"),
});

export const preferredSlotSchema = z
  .object({
    date: z
      .union([z.string(), z.date()])
      .transform((val) => parseIstDateMidday(val))
      .refine((date) => !isNaN(date.getTime()), {
        message: "A valid repair date is required",
      })
      .refine(
        (date) => {
          const todayIst = getIstDateString(0);
          const startOfTodayIst = new Date(`${todayIst}T00:00:00+05:30`);
          return date >= startOfTodayIst;
        },
        {
          message: "Repair booking date cannot be in the past",
        }
      )
      .refine(
        (date) => {
          const maxIst = getIstDateString(30);
          const endOfMaxIst = new Date(`${maxIst}T23:59:59+05:30`);
          return date <= endOfMaxIst;
        },
        {
          message: "Repair booking date cannot be more than 30 days in advance",
        }
      ),
    timeSlot: z
      .string()
      .trim()
      .min(3, "Preferred time slot is required (at least 3 characters)")
      .max(100, "Time slot description is too long"),
  })
  .superRefine((slot, ctx) => {
    const todayIst = getIstDateString(0);
    const slotIstDate = getIstDateString(0, slot.date);
    const istMinutes = getIstMinutesFromMidnight();

    if (slotIstDate === todayIst) {
      if (istMinutes > CUTOFFS.EXPRESS_MINUTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["date"],
          message:
            "Same-day doorstep repair dispatch closes at 8:15 PM IST. Please select tomorrow or a future date.",
        });
      }
    }
  });

export const createRepairRequestSchema = z.object({
  customer: customerSchema,
  device: deviceSchema,
  service: z.string().optional(),
  issueDescription: z
    .string()
    .trim()
    .min(2, "Please select or describe the repair issue")
    .max(1000, "Issue description is too long (maximum 1000 characters)"),
  serviceMode: z
    .enum(["doorstep", "pickup_drop", "walk_in"])
    .default("doorstep"),
  address: addressSchema,
  preferredSlot: preferredSlotSchema,
  pricing: z
    .object({
      estimatedPrice: z.coerce.number().min(0).optional(),
      paymentStatus: z.enum(["unpaid", "paid", "cod"]).default("unpaid").optional(),
    })
    .optional(),
  locale: z.enum(["en", "hi", "mr"]).default("en"),
});

export const updateRepairRequestSchema = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ])
    .optional(),
  pricing: z
    .object({
      estimatedPrice: z.coerce.number().min(0).optional(),
      finalPrice: z.coerce.number().min(0).optional(),
      paymentStatus: z.enum(["unpaid", "paid", "cod"]).optional(),
      paymentMethod: z.enum(["cash", "upi", "card", "online"]).optional(),
    })
    .optional(),
  warranty: z
    .object({
      warrantyExpiry: z.coerce.date().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

// -------------------------------------------------------------
// 7. TRACK REPAIR VALIDATION
// -------------------------------------------------------------

export const trackRepairSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(5, "Tracking number must be at least 5 characters")
    .max(30, "Tracking number cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Invalid tracking number format"),
});

// -------------------------------------------------------------
// 8. CUSTOMER REVIEWS VALIDATION
// -------------------------------------------------------------

export const createReviewSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters")
    .trim(),
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .min(10, "Please provide at least 10 characters in your review")
    .max(1000, "Review comment cannot exceed 1000 characters")
    .trim(),
  deviceModel: z.string().max(100).trim().optional(),
  serviceType: z.string().max(100).trim().optional(),
  area: z.string().max(100).trim().optional(),
  locale: z.enum(["en", "hi", "mr"]).default("en"),
});

export const updateReviewStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  isFeatured: z.boolean().optional(),
  adminNotes: z.string().trim().optional(),
  name: z.string().min(2).max(80).trim().optional(),
  comment: z.string().min(10).max(1000).trim().optional(),
  deviceModel: z.string().max(100).trim().optional(),
  serviceType: z.string().max(100).trim().optional(),
  area: z.string().max(100).trim().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});
