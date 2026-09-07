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

  const models = await DeviceModel.find(filter)
    .populate("brand", "name slug logoUrl")
    .populate("servicePricing.service", "name slug startingPrice warrantyDays")
    .sort({ isPopular: -1, name: 1 })
    .lean();

  return apiSuccess({
    models,
    total: models.length,
  });
});
