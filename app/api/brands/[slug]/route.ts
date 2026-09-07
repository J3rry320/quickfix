import { NextRequest } from "next/server";
import { Brand } from "@/models/Brand";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess, apiError } from "@/lib/api/response";

export const GET = withPublicApi<{ slug: string }>(
  async (_request: NextRequest, { params }) => {
    const { slug } = params;

    const brand = await Brand.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    }).lean();

    if (!brand) {
      return apiError("Brand not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ brand });
  }
);
