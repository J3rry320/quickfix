import { NextRequest } from "next/server";
import { RepairRequest } from "@/models/RepairRequest";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess, apiError } from "@/lib/api/response";
import { trackRepairSchema } from "@/lib/api/validators";

export const POST = withPublicApi(
  async (request: NextRequest) => {
    const body = await request.json();
    const { reference } = trackRepairSchema.parse(body);

    const cleanRef = reference.trim().toUpperCase();

    // Query strictly non-sensitive fields from MongoDB.
    // Exclude customer name/phone/email, address, pricing, and internal notes.
    const repair = await RepairRequest.findOne({ bookingReference: cleanRef })
      .select("bookingReference status createdAt updatedAt device.brand device.model -_id")
      .lean();

    if (!repair) {
      return apiError(
        `No repair booking found with reference code "${cleanRef}". Please check your booking code and try again.`,
        404,
        "REPAIR_NOT_FOUND"
      );
    }

    return apiSuccess({
      tracking: {
        bookingReference: repair.bookingReference,
        status: repair.status,
        createdAt: repair.createdAt,
        updatedAt: repair.updatedAt,
        device: {
          brand: repair.device?.brand || "Smartphone",
          model: repair.device?.model || "",
        },
      },
    });
  },
  { csrf: true, rateLimitType: "auth" }
);
