import { NextRequest } from "next/server";
import { RepairRequest } from "@/models/RepairRequest";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess } from "@/lib/api/response";
import {
  createRepairRequestSchema,
  getUniqueBookingReference,
} from "@/lib/api/validators";

export const POST = withPublicApi(
  async (request: NextRequest) => {
    const body = await request.json();
    const validatedData = createRepairRequestSchema.parse(body);

    const bookingReference = await getUniqueBookingReference();

    const repairRequest = await RepairRequest.create({
      ...validatedData,
      bookingReference,
      status: "pending",
      pricing: {
        estimatedPrice: validatedData.pricing?.estimatedPrice,
        paymentStatus: validatedData.pricing?.paymentStatus || "unpaid",
      },
    });

    return apiSuccess(
      {
        message: "Repair request booked successfully",
        bookingReference: repairRequest.bookingReference,
        status: repairRequest.status,
        requestId: repairRequest._id,
      },
      201
    );
  },
  { csrf: true, rateLimitType: "auth" }
);
