import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { BlogPost } from "@/models/BlogPost";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import { updateBlogSchema, slugify } from "@/lib/api/validators";

export const GET = withAdminAuth<{ id: string }>(
  async (_request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid blog post ID", 400, "INVALID_ID");
    }

    const blog = await BlogPost.findById(id).lean();
    if (!blog) {
      return apiError("Blog post not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ blog });
  }
);

export const PATCH = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid blog post ID", 400, "INVALID_ID");
    }

    const body = await request.json();
    const validated = updateBlogSchema.parse(body);

    if (validated.slug) {
      validated.slug = slugify(validated.slug);
      const existing = await BlogPost.findOne({
        slug: validated.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("Slug is already in use by another post", 409, "DUPLICATE_SLUG");
      }
    }

    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return apiError("Blog post not found", 404, "NOT_FOUND");
    }

    // If publishing now for the first time, set publishedAt
    if (validated.isPublished && !existingPost.publishedAt && !validated.publishedAt) {
      validated.publishedAt = new Date();
    }

    const updatedBlog = await BlogPost.findByIdAndUpdate(
      id,
      { $set: validated },
      { new: true, runValidators: true }
    ).lean();

    return apiSuccess({ blog: updatedBlog });
  }
);

export const DELETE = withAdminAuth<{ id: string }>(
  async (request: NextRequest, { params }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid blog post ID", 400, "INVALID_ID");
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      const deleted = await BlogPost.findByIdAndDelete(id);
      if (!deleted) {
        return apiError("Blog post not found", 404, "NOT_FOUND");
      }
      return apiSuccess({ message: "Blog post permanently deleted", id });
    }

    // Default: Soft Delete (Unpublish)
    const blog = await BlogPost.findByIdAndUpdate(
      id,
      { $set: { isPublished: false } },
      { new: true }
    ).lean();

    if (!blog) {
      return apiError("Blog post not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ message: "Blog post unpublished (soft deleted)", blog });
  }
);
