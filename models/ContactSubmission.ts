import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactSubmission extends Document {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  area?: string;
  status: "new" | "in_progress" | "contacted" | "resolved" | "archived";
  source: string;
  locale: "en" | "hi" | "mr";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "contacted", "resolved", "archived"],
      default: "new",
      index: true,
    },
    source: {
      type: String,
      default: "contact_page",
      trim: true,
    },
    locale: {
      type: String,
      enum: ["en", "hi", "mr"],
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

export const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    ContactSubmissionSchema
  );

export default ContactSubmission;
