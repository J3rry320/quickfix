import { NextRequest } from "next/server";
import { BlogPost } from "@/models/BlogPost";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess } from "@/lib/api/response";

export const GET = withPublicApi(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language");
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { isPublished: true };

  if (language && ["en", "hi", "mr"].includes(language)) {
    filter.language = language;
  }
  if (category) {
    filter.category = category;
  }
  if (tag) {
    filter.tags = tag;
  }

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .select("-content")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(filter),
  ]);

  return apiSuccess({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
