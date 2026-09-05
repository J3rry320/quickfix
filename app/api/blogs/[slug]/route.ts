import { NextRequest } from "next/server";
import { BlogPost } from "@/models/BlogPost";
import { withPublicApi } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";

export const GET = withPublicApi<{ slug: string }>(
  async (_request: NextRequest, { params }) => {
    const { slug } = params;

    // Atomically increment viewCount and retrieve document
    const post = await BlogPost.findOneAndUpdate(
      { slug: slug.toLowerCase(), isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return apiError("Blog post not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ post });
  }
);
