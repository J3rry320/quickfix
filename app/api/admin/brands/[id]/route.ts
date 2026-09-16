import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { Brand } from "@/models/Brand";
import { DeviceModel } from "@/models/DeviceModel";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { updateBrandSchema, slugify } from "@/lib/api/validators";

export const GET = withAdminAuth<{ id: string }>(
  async (_request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid brand ID", 400, "INVALID_ID");
    }

    const brand = await Brand.findById(id).lean();
    if (!brand) {
      return apiError("Brand not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ brand });
  }
);

export const PATCH = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid brand ID", 400, "INVALID_ID");
    }

    const body = await request.json();
    const validated = updateBrandSchema.parse(body);

    if (validated.slug) {
      validated.slug = slugify(validated.slug);
      const existing = await Brand.findOne({
        slug: validated.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("Slug is already in use by another brand", 409, "DUPLICATE_SLUG");
      }
    }

    if (validated.name) {
      const existing = await Brand.findOne({
        name: { $regex: `^${validated.name}$`, $options: "i" },
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("Brand name is already in use", 409, "DUPLICATE_NAME");
      }
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { $set: validated },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!updatedBrand) {
      return apiError("Brand not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ brand: updatedBrand });
  }
);

export const DELETE = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid brand ID", 400, "INVALID_ID");
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      // Check if any device models reference this brand
      const modelsCount = await DeviceModel.countDocuments({ brand: id });
      if (modelsCount > 0) {
        return apiError(
          `Cannot delete brand: ${modelsCount} device model(s) are associated with it. Please reassign or remove them first.`,
          409,
          "REFERENTIAL_INTEGRITY_CONFLICT"
        );
      }

      const deleted = await Brand.findByIdAndDelete(id);
      if (!deleted) {
        return apiError("Brand not found", 404, "NOT_FOUND");
      }
      return apiSuccess({ message: "Brand permanently deleted", id });
    }

    // Default: Soft Delete
    const brand = await Brand.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { returnDocument: "after" }
    ).lean();

    if (!brand) {
      return apiError("Brand not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ message: "Brand deactivated (soft deleted)", brand });
  }
);
