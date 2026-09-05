import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { DeviceModel } from "@/models/DeviceModel";
import { Brand } from "@/models/Brand";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { updateModelSchema, slugify } from "@/lib/api/validators";

export const GET = withAdminAuth<{ id: string }>(
  async (_request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid model ID", 400, "INVALID_ID");
    }

    const model = await DeviceModel.findById(id)
      .populate("brand", "name slug logoUrl")
      .populate("servicePricing.service", "name slug startingPrice")
      .lean();

    if (!model) {
      return apiError("Device model not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ model });
  }
);

export const PATCH = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid model ID", 400, "INVALID_ID");
    }

    const body = await request.json();
    const validated = updateModelSchema.parse(body);

    if (validated.brand) {
      if (!mongoose.Types.ObjectId.isValid(validated.brand)) {
        return apiError("Invalid brand ID", 400, "INVALID_BRAND_ID");
      }
      const brandExists = await Brand.exists({ _id: validated.brand });
      if (!brandExists) {
        return apiError("Referenced brand does not exist", 404, "BRAND_NOT_FOUND");
      }
    }

    if (validated.slug) {
      validated.slug = slugify(validated.slug);
      const existing = await DeviceModel.findOne({
        slug: validated.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("Slug is already in use by another model", 409, "DUPLICATE_SLUG");
      }
    }

    const updatedModel = await DeviceModel.findByIdAndUpdate(
      id,
      { $set: validated },
      { new: true, runValidators: true }
    )
      .populate("brand", "name slug logoUrl")
      .populate("servicePricing.service", "name slug startingPrice")
      .lean();

    if (!updatedModel) {
      return apiError("Device model not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ model: updatedModel });
  }
);

export const DELETE = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid model ID", 400, "INVALID_ID");
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      const deleted = await DeviceModel.findByIdAndDelete(id);
      if (!deleted) {
        return apiError("Device model not found", 404, "NOT_FOUND");
      }
      return apiSuccess({ message: "Device model permanently deleted", id });
    }

    // Default: Soft Delete
    const model = await DeviceModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).lean();

    if (!model) {
      return apiError("Device model not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ message: "Device model deactivated (soft deleted)", model });
  }
);
