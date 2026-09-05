import { NextRequest } from "next/server";
import { RepairRequest } from "@/models/RepairRequest";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess } from "@/lib/api/response";

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const area = searchParams.get("area");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (
    status &&
    [
      "pending",
      "confirmed",
      "technician_assigned",
      "in_progress",
      "completed",
      "cancelled",
    ].includes(status)
  ) {
    filter.status = status;
  }

  if (area) {
    filter["address.area"] = { $regex: area, $options: "i" };
  }

  if (search) {
    filter.$or = [
      { bookingReference: { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "device.model": { $regex: search, $options: "i" } },
    ];
  }

  const [requests, total] = await Promise.all([
    RepairRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    RepairRequest.countDocuments(filter),
  ]);

  return apiSuccess({
    requests,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
