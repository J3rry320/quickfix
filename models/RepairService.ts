import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRepairService extends Document {
  name: string;
  slug: string;
  description: string;
  estimatedTimeMinutes: number;
  startingPrice: number;
  warrantyDays: number;
  icon?: string;
  image?: string;
  isPopular: boolean;
  commonIssues: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RepairServiceSchema = new Schema<IRepairService>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Service slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    estimatedTimeMinutes: {
      type: Number,
      required: true,
      default: 30,
      min: 5,
    },
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
      min: 0,
    },
    warrantyDays: {
      type: Number,
      required: true,
      default: 90,
      min: 0,
    },
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    commonIssues: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RepairService: Model<IRepairService> =
  mongoose.models.RepairService ||
  mongoose.model<IRepairService>("RepairService", RepairServiceSchema);

export default RepairService;
