import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IModelServicePrice {
  service: Types.ObjectId;
  price: number;
  estimatedTimeMinutes?: number;
}

export interface IDeviceModel extends Document {
  brand: Types.ObjectId;
  name: string;
  slug: string;
  releaseYear?: number;
  imageUrl?: string;
  isPopular: boolean;
  servicePricing: IModelServicePrice[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModelServicePriceSchema = new Schema<IModelServicePrice>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "RepairService",
      required: [true, "Service reference is required"],
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: 0,
    },
    estimatedTimeMinutes: {
      type: Number,
      default: 30,
      min: 5,
    },
  },
  { _id: false }
);

const DeviceModelSchema = new Schema<IDeviceModel>(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand reference is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Model name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Model slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    releaseYear: {
      type: Number,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    servicePricing: {
      type: [ModelServicePriceSchema],
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

export const DeviceModel: Model<IDeviceModel> =
  mongoose.models.DeviceModel ||
  mongoose.model<IDeviceModel>("DeviceModel", DeviceModelSchema);

export default DeviceModel;
