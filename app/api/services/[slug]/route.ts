import { NextRequest } from "next/server";
import { RepairService } from "@/models/RepairService";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess, apiError } from "@/lib/api/response";

export const GET = withPublicApi<{ slug: string }>(
  async (_request: NextRequest, { params }) => {
    const { slug } = params;

    const service = await RepairService.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    }).lean();

    if (!service) {
      return apiError("Service not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ service });
  }
);
