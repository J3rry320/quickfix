import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { RepairRequest } from "@/models/RepairRequest";
import "@/models/RepairService";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { updateRepairRequestSchema } from "@/lib/api/validators";

export const GET = withAdminAuth<{ id: string }>(
  async (_request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid repair request ID", 400, "INVALID_ID");
    }

    const requestDoc = await RepairRequest.findById(id)
      .populate("service", "name slug startingPrice image icon")
      .lean();
    if (!requestDoc) {
      return apiError("Repair request not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ request: requestDoc });
  }
);

export const PATCH = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid repair request ID", 400, "INVALID_ID");
    }

    const body = await request.json();
    const validated = updateRepairRequestSchema.parse(body);

    const updateFields: Record<string, unknown> = {};

    if (validated.status) {
      updateFields.status = validated.status;
    }

    if (validated.pricing) {
      if (validated.pricing.estimatedPrice !== undefined) {
        updateFields["pricing.estimatedPrice"] = validated.pricing.estimatedPrice;
      }
      if (validated.pricing.finalPrice !== undefined) {
        updateFields["pricing.finalPrice"] = validated.pricing.finalPrice;
      }
      if (validated.pricing.paymentStatus !== undefined) {
        updateFields["pricing.paymentStatus"] = validated.pricing.paymentStatus;
      }
      if (validated.pricing.paymentMethod !== undefined) {
        updateFields["pricing.paymentMethod"] = validated.pricing.paymentMethod;
      }
    }

    if (validated.warranty) {
      if (validated.warranty.warrantyExpiry !== undefined) {
        updateFields["warranty.warrantyExpiry"] = validated.warranty.warrantyExpiry;
      }
      if (validated.warranty.notes !== undefined) {
        updateFields["warranty.notes"] = validated.warranty.notes;
      }
    }

    const updated = await RepairRequest.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return apiError("Repair request not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ request: updated });
  }
);

export const DELETE = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid repair request ID", 400, "INVALID_ID");
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      const deleted = await RepairRequest.findByIdAndDelete(id);
      if (!deleted) {
        return apiError("Repair request not found", 404, "NOT_FOUND");
      }
      return apiSuccess({ message: "Repair request permanently deleted", id });
    }

    // Default: Soft Delete (Cancel)
    const cancelled = await RepairRequest.findByIdAndUpdate(
      id,
      { $set: { status: "cancelled" } },
      { new: true }
    ).lean();

    if (!cancelled) {
      return apiError("Repair request not found", 404, "NOT_FOUND");
    }

    return apiSuccess({
      message: "Repair request cancelled (soft deleted)",
      request: cancelled,
    });
  }
);
