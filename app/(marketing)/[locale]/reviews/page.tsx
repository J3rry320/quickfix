import type { Metadata } from "next";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { routing } from "@/i18n/routing";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getReviewsPageSchema, getBreadcrumbSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui";
import ReviewsClient, { ReviewItem } from "@/components/reviews/ReviewsClient";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({
    page: "reviews",
    locale,
    path: "/reviews",
  });
}

async function getCachedApprovedReviews(): Promise<{
  reviews: ReviewItem[];
  total: number;
  avgRating: number;
}> {
  "use cache";
  cacheLife("hours");
  cacheTag("reviews");

  try {
    await connectToDatabase();
    const [dbReviews, total, aggregate] = await Promise.all([
      Review.find({ status: "approved" })
        .select("_id name rating comment deviceModel serviceType area createdAt isFeatured")
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(12)
        .lean(),
      Review.countDocuments({ status: "approved" }),
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

    return {
      reviews: (dbReviews || []).map((r) => ({
        _id: String(r._id),
        name: r.name,
        rating: r.rating,
        comment: r.comment,
        deviceModel: r.deviceModel,
        serviceType: r.serviceType,
        area: r.area,
        isFeatured: r.isFeatured,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      })),
      total: total || 0,
      avgRating: aggregate[0]?.avgRating ? Number(aggregate[0].avgRating.toFixed(1)) : 5.0,
    };
  } catch (err) {
    console.error("Failed to load reviews from database:", err);
    return {
      reviews: [],
      total: 0,
      avgRating: 5.0,
    };
  }
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const { reviews: initialReviews, total: initialTotal, avgRating: initialAvgRating } =
    await getCachedApprovedReviews();

  const reviewsSchema = getReviewsPageSchema(locale, {
    avgRating: initialAvgRating,
    totalReviews: initialTotal,
    reviews: initialReviews,
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Customer Reviews", url: `${siteUrl}/${locale}/reviews` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white min-h-[calc(100vh-4rem)]">
      <JsonLd schema={[reviewsSchema, breadcrumbSchema]} id="reviews-structured-data" />

      {/* Hero Section without eyebrows */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Customer Reviews" },
        ]}
        title="Customer Reviews & Ratings"
        subtitle="Genuine, verified reviews from smartphone users who had their devices repaired by QuickFix Pune."
        align="center"
      />

      {/* Reviews Content */}
      <div className="flex-1 bg-clean-white">
        <Suspense
          fallback={
            <div className="py-12 text-center text-xs text-text-muted">
              Loading customer reviews...
            </div>
          }
        >
          <ReviewsClient
            initialReviews={initialReviews}
            initialTotal={initialTotal}
            initialAvgRating={initialAvgRating}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  );
}
