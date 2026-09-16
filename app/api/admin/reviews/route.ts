import { NextRequest } from "next/server";
import { Review } from "@/models/Review";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess } from "@/lib/api/response";

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { comment: { $regex: search, $options: "i" } },
      { deviceModel: { $regex: search, $options: "i" } },
      { area: { $regex: search, $options: "i" } },
    ];
  }

  const [reviews, total, pendingCount, approvedCount, rejectedCount] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
    Review.countDocuments({ status: "pending" }),
    Review.countDocuments({ status: "approved" }),
    Review.countDocuments({ status: "rejected" }),
  ]);

  return apiSuccess({
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    counts: {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      total: pendingCount + approvedCount + rejectedCount,
    },
  });
});
