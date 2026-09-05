import { NextRequest } from "next/server";
import { ContactSubmission } from "@/models/ContactSubmission";
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
    ["new", "in_progress", "contacted", "resolved", "archived"].includes(status)
  ) {
    filter.status = status;
  }

  if (area) {
    filter.area = { $regex: area, $options: "i" };
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const [contacts, total] = await Promise.all([
    ContactSubmission.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ContactSubmission.countDocuments(filter),
  ]);

  return apiSuccess({
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
