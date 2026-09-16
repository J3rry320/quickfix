import { NextRequest } from "next/server";
import { DeviceModel } from "@/models/DeviceModel";
import { Brand } from "@/models/Brand";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess } from "@/lib/api/response";
import mongoose from "mongoose";

export const GET = withPublicApi(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const brandParam = searchParams.get("brand");
  const search = searchParams.get("search");
  const popularOnly = searchParams.get("popular") === "true";

  const filter: Record<string, unknown> = { isActive: true };

  if (popularOnly) {
    filter.isPopular = true;
  }

  if (brandParam) {
    if (mongoose.Types.ObjectId.isValid(brandParam)) {
      filter.brand = brandParam;
    } else {
      // Find brand by slug
      const foundBrand = await Brand.findOne({
        slug: brandParam.toLowerCase(),
      }).select("_id");
      if (foundBrand) {
        filter.brand = foundBrand._id;
      } else {
        return apiSuccess({ models: [], total: 0 });
      }
    }
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.max(1, Math.min(100, parseInt(limitParam, 10))) : 0;

  let query = DeviceModel.find(filter)
    .populate("brand", "name slug logoUrl")
    .populate("servicePricing.service", "name slug startingPrice warrantyDays")
    .sort({ isPopular: -1, releaseYear: -1, name: 1 });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const models = await query.lean();

  return apiSuccess({
    models,
    total: models.length,
  });
});
