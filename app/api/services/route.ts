import { NextRequest } from "next/server";
import { RepairService } from "@/models/RepairService";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess } from "@/lib/api/response";

export const GET = withPublicApi(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const popularOnly = searchParams.get("popular") === "true";

  const filter: Record<string, unknown> = { isActive: true };
  if (popularOnly) {
    filter.isPopular = true;
  }

  const services = await RepairService.find(filter)
    .sort({ isPopular: -1, name: 1 })
    .lean();

  return apiSuccess({
    services,
    total: services.length,
  });
});
