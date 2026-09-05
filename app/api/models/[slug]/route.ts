import { NextRequest } from "next/server";
import { DeviceModel } from "@/models/DeviceModel";
import { withPublicApi } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";

export const GET = withPublicApi<{ slug: string }>(
  async (_request: NextRequest, { params }) => {
    const { slug } = params;

    const model = await DeviceModel.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    })
      .populate("brand", "name slug logoUrl")
      .populate("servicePricing.service", "name slug startingPrice warrantyDays")
      .lean();

    if (!model) {
      return apiError("Device model not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ model });
  }
);
