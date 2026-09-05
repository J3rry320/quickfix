import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { DeviceModel } from "@/models/DeviceModel";
import { Brand } from "@/models/Brand";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { createModelSchema, slugify } from "@/lib/api/validators";

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brand");
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (status === "active") {
    filter.isActive = true;
  } else if (status === "inactive") {
    filter.isActive = false;
  }

  if (brandId && mongoose.Types.ObjectId.isValid(brandId)) {
    filter.brand = brandId;
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const [models, total] = await Promise.all([
    DeviceModel.find(filter)
      .populate("brand", "name slug logoUrl")
      .populate("servicePricing.service", "name slug startingPrice")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    DeviceModel.countDocuments(filter),
  ]);

  return apiSuccess({
    models,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  const body = await request.json();
  const validated = createModelSchema.parse(body);

  if (!mongoose.Types.ObjectId.isValid(validated.brand)) {
    return apiError("Invalid brand ID", 400, "INVALID_BRAND_ID");
  }

  // Verify brand exists
  const brandExists = await Brand.exists({ _id: validated.brand });
  if (!brandExists) {
    return apiError("Referenced brand does not exist", 404, "BRAND_NOT_FOUND");
  }

  const slug = validated.slug ? slugify(validated.slug) : slugify(validated.name);

  // Check unique slug
  const existing = await DeviceModel.findOne({ slug });
  if (existing) {
    return apiError("A model with this slug already exists", 409, "DUPLICATE_SLUG");
  }

  const model = await DeviceModel.create({
    ...validated,
    slug,
  });

  const populated = await DeviceModel.findById(model._id)
    .populate("brand", "name slug logoUrl")
    .populate("servicePricing.service", "name slug startingPrice")
    .lean();

  return apiSuccess({ model: populated }, 201);
});
