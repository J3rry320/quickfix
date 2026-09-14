import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRepairRequestCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface IRepairRequestDevice {
  brand: string;
  model: string;
  color?: string;
}

export interface IRepairRequestAddress {
  area: string;
  streetAddress: string;
  pincode: string;
  landmark?: string;
  city: string;
}

export interface IRepairRequestSlot {
  date: Date;
  timeSlot: string;
}

export interface IRepairRequestPricing {
  estimatedPrice?: number;
  finalPrice?: number;
  paymentStatus: "unpaid" | "paid" | "cod";
  paymentMethod?: "cash" | "upi" | "card" | "online";
}

export interface IRepairRequestWarranty {
  warrantyExpiry?: Date;
  notes?: string;
}

export interface IRepairRequest extends Document {
  bookingReference: string;
  customer: IRepairRequestCustomer;
  device: IRepairRequestDevice;
  service?: Types.ObjectId | string;
  issueDescription: string;
  serviceMode: "doorstep" | "pickup_drop" | "walk_in";
  address: IRepairRequestAddress;
  preferredSlot: IRepairRequestSlot;
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled";
  pricing: IRepairRequestPricing;
  warranty?: IRepairRequestWarranty;
  locale: "en" | "hi" | "mr";
  createdAt: Date;
  updatedAt: Date;
}

const RepairRequestSchema = new Schema<IRepairRequest>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Customer phone number is required"],
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },
    device: {
      brand: {
        type: String,
        required: [true, "Device brand is required"],
        trim: true,
      },
      model: {
        type: String,
        required: [true, "Device model is required"],
        trim: true,
      },
      color: {
        type: String,
        trim: true,
      },
    },
    service: {
      type: Schema.Types.Mixed,
      trim: true,
    },
    issueDescription: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
    },
    serviceMode: {
      type: String,
      enum: ["doorstep", "pickup_drop", "walk_in"],
      default: "doorstep",
      required: true,
    },
    address: {
      area: {
        type: String,
        required: [true, "Pune locality/area is required"],
        trim: true,
      },
      streetAddress: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        default: "Pune",
        trim: true,
      },
    },
    preferredSlot: {
      date: {
        type: Date,
        required: [true, "Preferred repair date is required"],
      },
      timeSlot: {
        type: String,
        required: [true, "Preferred time slot is required"],
        trim: true,
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
    pricing: {
      estimatedPrice: { type: Number, min: 0 },
      finalPrice: { type: Number, min: 0 },
      paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "cod"],
        default: "unpaid",
      },
      paymentMethod: {
        type: String,
        enum: ["cash", "upi", "card", "online"],
      },
    },
    warranty: {
      warrantyExpiry: { type: Date },
      notes: { type: String, trim: true },
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

export const RepairRequest: Model<IRepairRequest> =
  mongoose.models.RepairRequest ||
  mongoose.model<IRepairRequest>("RepairRequest", RepairRequestSchema);

export default RepairRequest;
