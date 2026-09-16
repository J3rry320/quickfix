import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { Review } from "@/models/Review";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { updateReviewStatusSchema } from "@/lib/api/validators";

export const GET = withAdminAuth<{ id: string }>(
  async (_request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid review ID", 400, "INVALID_ID");
    }

    const review = await Review.findById(id).lean();
    if (!review) {
      return apiError("Review not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ review });
  }
);

export const PATCH = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid review ID", 400, "INVALID_ID");
    }

    const body = await request.json();
    const validated = updateReviewStatusSchema.parse(body);

    const updateFields: Record<string, unknown> = {};
    if (validated.status !== undefined) {
      updateFields.status = validated.status;
    }
    if (validated.isFeatured !== undefined) {
      updateFields.isFeatured = validated.isFeatured;
    }
    if (validated.adminNotes !== undefined) {
      updateFields.adminNotes = validated.adminNotes;
    }
    if (validated.name !== undefined) {
      updateFields.name = validated.name;
    }
    if (validated.comment !== undefined) {
      updateFields.comment = validated.comment;
    }
    if (validated.deviceModel !== undefined) {
      updateFields.deviceModel = validated.deviceModel;
    }
    if (validated.serviceType !== undefined) {
      updateFields.serviceType = validated.serviceType;
    }
    if (validated.area !== undefined) {
      updateFields.area = validated.area;
    }
    if (validated.rating !== undefined) {
      updateFields.rating = validated.rating;
    }

    const updated = await Review.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: "after" }
    ).lean();

    if (!updated) {
      return apiError("Review not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ review: updated });
  }
);

export const DELETE = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid review ID", 400, "INVALID_ID");
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      const deleted = await Review.findByIdAndDelete(id);
      if (!deleted) {
        return apiError("Review not found", 404, "NOT_FOUND");
      }
      return apiSuccess({ message: "Review permanently deleted", id });
    }

    // Default: Soft Delete (Set status to rejected)
    const rejected = await Review.findByIdAndUpdate(
      id,
      { $set: { status: "rejected" } },
      { returnDocument: "after" }
    ).lean();

    if (!rejected) {
      return apiError("Review not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ message: "Review marked as rejected", review: rejected });
  }
);
