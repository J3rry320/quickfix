import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  name: string;
  rating: number;
  comment: string;
  deviceModel?: string;
  serviceType?: string;
  area?: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  adminNotes?: string;
  locale: "en" | "hi" | "mr";
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"],
      index: true,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },
    deviceModel: {
      type: String,
      trim: true,
      maxlength: [100, "Device model cannot exceed 100 characters"],
    },
    serviceType: {
      type: String,
      trim: true,
      maxlength: [100, "Service type cannot exceed 100 characters"],
    },
    area: {
      type: String,
      trim: true,
      maxlength: [100, "Area cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    adminNotes: {
      type: String,
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

// Compound index for public query efficiency: approved reviews sorted by newest
ReviewSchema.index({ status: 1, createdAt: -1 });

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
