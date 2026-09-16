import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { ContactSubmission } from "@/models/ContactSubmission";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { updateContactStatusSchema } from "@/lib/api/validators";

export const GET = withAdminAuth<{ id: string }>(
  async (_request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid contact ID", 400, "INVALID_ID");
    }

    const contact = await ContactSubmission.findById(id).lean();
    if (!contact) {
      return apiError("Contact submission not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ contact });
  }
);

export const PATCH = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid contact ID", 400, "INVALID_ID");
    }

    const body = await request.json();
    const validated = updateContactStatusSchema.parse(body);

    const updateFields: Record<string, unknown> = {};
    if (validated.status !== undefined) {
      updateFields.status = validated.status;
    }
    if (validated.internalNotes !== undefined) {
      updateFields.internalNotes = validated.internalNotes;
    }

    const updated = await ContactSubmission.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: "after" }
    ).lean();

    if (!updated) {
      return apiError("Contact submission not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ contact: updated });
  }
);

export const DELETE = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid contact ID", 400, "INVALID_ID");
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      const deleted = await ContactSubmission.findByIdAndDelete(id);
      if (!deleted) {
        return apiError("Contact submission not found", 404, "NOT_FOUND");
      }
      return apiSuccess({ message: "Contact inquiry permanently deleted", id });
    }

    // Default: Soft Delete (Archive)
    const archived = await ContactSubmission.findByIdAndUpdate(
      id,
      { $set: { status: "archived" } },
      { returnDocument: "after" }
    ).lean();

    if (!archived) {
      return apiError("Contact submission not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ message: "Contact inquiry archived", contact: archived });
  }
);
