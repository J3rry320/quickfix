import { NextRequest } from "next/server";
import { RepairService } from "@/models/RepairService";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { createServiceSchema, slugify } from "@/lib/api/validators";

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
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [services, total] = await Promise.all([
    RepairService.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    RepairService.countDocuments(filter),
  ]);

  return apiSuccess({
    services,
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
  const validated = createServiceSchema.parse(body);

  const slug = validated.slug ? slugify(validated.slug) : slugify(validated.name);

  // Check unique slug
  const existing = await RepairService.findOne({ slug });
  if (existing) {
    return apiError("A service with this slug already exists", 409, "DUPLICATE_SLUG");
  }

  const service = await RepairService.create({
    ...validated,
    slug,
  });

  return apiSuccess({ service }, 201);
});
