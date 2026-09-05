import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { RepairService } from "@/models/RepairService";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { updateServiceSchema, slugify } from "@/lib/api/validators";

export const GET = withAdminAuth<{ id: string }>(
  async (_request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid service ID", 400, "INVALID_ID");
    }

    const service = await RepairService.findById(id).lean();
    if (!service) {
      return apiError("Service not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ service });
  }
);

export const PATCH = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid service ID", 400, "INVALID_ID");
    }

    const body = await request.json();
    const validated = updateServiceSchema.parse(body);

    if (validated.slug) {
      validated.slug = slugify(validated.slug);
      const existing = await RepairService.findOne({
        slug: validated.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("Slug is already in use by another service", 409, "DUPLICATE_SLUG");
      }
    }

    const updatedService = await RepairService.findByIdAndUpdate(
      id,
      { $set: validated },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedService) {
      return apiError("Service not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ service: updatedService });
  }
);

export const DELETE = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid service ID", 400, "INVALID_ID");
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      const deleted = await RepairService.findByIdAndDelete(id);
      if (!deleted) {
        return apiError("Service not found", 404, "NOT_FOUND");
      }
      return apiSuccess({ message: "Service permanently deleted", id });
    }

    // Default: Soft Delete
    const service = await RepairService.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).lean();

    if (!service) {
      return apiError("Service not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ message: "Service deactivated (soft deleted)", service });
  }
);
