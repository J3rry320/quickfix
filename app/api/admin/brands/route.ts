import { NextRequest } from "next/server";
import { Brand } from "@/models/Brand";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { createBrandSchema, slugify } from "@/lib/api/validators";

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
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

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const [brands, total] = await Promise.all([
    Brand.find(filter)
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Brand.countDocuments(filter),
  ]);

  return apiSuccess({
    brands,
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
  const validated = createBrandSchema.parse(body);

  const slug = validated.slug ? slugify(validated.slug) : slugify(validated.name);

  // Check unique slug and name
  const existing = await Brand.findOne({
    $or: [{ slug }, { name: { $regex: `^${validated.name}$`, $options: "i" } }],
  });
  if (existing) {
    return apiError("Brand with this name or slug already exists", 409, "DUPLICATE_BRAND");
  }

  const brand = await Brand.create({
    ...validated,
    slug,
  });

  return apiSuccess({ brand }, 201);
});
