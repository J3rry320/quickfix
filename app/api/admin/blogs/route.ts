import { NextRequest } from "next/server";
import { BlogPost } from "@/models/BlogPost";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { createBlogSchema, slugify } from "@/lib/api/validators";

export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const language = searchParams.get("language");
  const category = searchParams.get("category");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (status === "published") {
    filter.isPublished = true;
  } else if (status === "draft") {
    filter.isPublished = false;
  }

  if (language && ["en", "hi", "mr"].includes(language)) {
    filter.language = language;
  }

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const [blogs, total] = await Promise.all([
    BlogPost.find(filter)
      .select("-content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(filter),
  ]);

  return apiSuccess({
    blogs,
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
  const validated = createBlogSchema.parse(body);

  const slug = validated.slug ? slugify(validated.slug) : slugify(validated.title);

  // Check unique slug
  const existing = await BlogPost.findOne({ slug });
  if (existing) {
    return apiError("A blog post with this slug already exists", 409, "DUPLICATE_SLUG");
  }

  const publishedAt =
    validated.isPublished && !validated.publishedAt
      ? new Date()
      : validated.publishedAt;

  const blog = await BlogPost.create({
    ...validated,
    slug,
    publishedAt,
  });

  return apiSuccess({ blog }, 201);
});
