import { NextRequest } from "next/server";
import { Review } from "@/models/Review";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess } from "@/lib/api/response";
import { createReviewSchema } from "@/lib/api/validators";

export const GET = withPublicApi(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const ratingParam = searchParams.get("rating");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { status: "approved" };

    if (ratingParam) {
      const parsedRating = parseInt(ratingParam, 10);
      if (parsedRating >= 1 && parsedRating <= 5) {
        filter.rating = parsedRating;
      }
    }

    const [reviews, total, aggregate] = await Promise.all([
      Review.find(filter)
        .select("_id name rating comment deviceModel serviceType area createdAt isFeatured")
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { status: "approved" } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = {
      avgRating: aggregate[0]?.avgRating ? Number(aggregate[0].avgRating.toFixed(1)) : 5.0,
      totalReviews: aggregate[0]?.count || 0,
    };

    return apiSuccess({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats,
    });
  },
  { csrf: false, rateLimitType: "general" }
);

export const POST = withPublicApi(
  async (request: NextRequest) => {
    const body = await request.json();
    const validated = createReviewSchema.parse(body);

    const review = await Review.create({
      name: validated.name,
      rating: validated.rating,
      comment: validated.comment,
      deviceModel: validated.deviceModel || undefined,
      serviceType: validated.serviceType || undefined,
      area: validated.area || undefined,
      locale: validated.locale || "en",
      status: "pending",
      isFeatured: false,
    });

    return apiSuccess(
      {
        message:
          "Thank you for your feedback! Your review has been submitted for moderation and will appear on the site once approved by our team.",
        reviewId: review._id,
      },
      201
    );
  },
  { csrf: true, rateLimitType: "auth" }
);
