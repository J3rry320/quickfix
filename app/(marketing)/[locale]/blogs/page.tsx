import BlogInfiniteGrid from "@/components/blog/BlogInfiniteGrid";
import JsonLd from "@/components/seo/JsonLd";
import { Container, CTABlock, PageHero, Section } from "@/components/ui";
import { getBlogHubSchema, getBreadcrumbSchema } from "@/config/jsonld";
import { siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getDbBlogCategories, getDbPublishedBlogs } from "@/lib/db/blogs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

export const instant = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    title: "Smartphone Repair Guides, Battery & Screen Tips | Quick Fix Pune",
    description:
      "Expert smartphone repair tutorials, lithium battery health guides, OLED screen replacement comparisons, and water damage first aid from Pune's leading doorstep technicians.",
    alternates: {
      canonical: `${siteUrl}/${locale}/blogs`,
      languages: {
        en: `${siteUrl}/en/blogs`,
        hi: `${siteUrl}/hi/blogs`,
        mr: `${siteUrl}/mr/blogs`,
      },
    },
    openGraph: {
      title: "Smartphone Repair Guides & Tips | Quick Fix Pune",
      description:
        "Comprehensive guides and troubleshooting advice from certified technicians. Same-day doorstep pickup and lab repair across Pune.",
      url: `${siteUrl}/${locale}/blogs`,
      type: "website",
      images: [
        {
          url: `${siteUrl}${siteConfig.defaultOgImage}`,
          width: 1200,
          height: 630,
          alt: "Quick Fix Smartphone Repair Guides & Tech Tips",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Smartphone Repair Guides & Tips | Quick Fix Pune",
      description:
        "Comprehensive guides and troubleshooting advice from certified technicians. Same-day doorstep pickup and lab repair across Pune.",
      images: [`${siteUrl}${siteConfig.defaultOgImage}`],
    },
  };
}

function BlogListSkeleton() {
  return (
    <Section variant="white" padding="default">
      <Container>
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 rounded-xl bg-mist-gray animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl border border-border-default bg-elevated-surface p-6 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-5 w-24 rounded-full bg-surface-hover" />
                <div className="h-6 w-3/4 rounded bg-surface-hover" />
                <div className="h-16 w-full rounded bg-mist-gray" />
              </div>
              <div className="h-5 w-1/3 rounded bg-surface-hover" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

async function BlogListingSection({
  searchParams,
  locale,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
  locale: string;
}) {
  const { category, search, page } = await searchParams;

  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const activeCategory = category || "All";

  const [blogData, categories] = await Promise.all([
    getDbPublishedBlogs({
      category: activeCategory,
      search,
      page: currentPage,
      limit: 9,
    }),
    getDbBlogCategories(),
  ]);

  const allCategories = ["All", ...categories];

  return (
    <Section variant="white" padding="default">
      <Container>
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-12 scrollbar-none">
          {allCategories.map((cat) => {
            const isActive = (cat === "All" && !category) || category === cat;
            return (
              <Link
                key={cat}
                href={
                  cat === "All"
                    ? "/blogs"
                    : `/blogs?category=${encodeURIComponent(cat)}`
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-flash-orange text-clean-white shadow-sm shadow-flash-orange/20"
                    : "bg-mist-gray text-tech-slate hover:bg-surface-hover border border-border-default"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* IntersectionObserver Infinite Scrolling Grid */}
        <BlogInfiniteGrid
          key={`${activeCategory}-${search || ""}`}
          initialPosts={blogData.posts}
          initialHasMore={blogData.hasMore}
          initialPage={currentPage}
          total={blogData.total}
          category={activeCategory}
          search={search}
          locale={locale}
        />
      </Container>
    </Section>
  );
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogsHub" });
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t("breadcrumbs.home"), url: `${siteUrl}/${locale}` },
    { name: t("breadcrumbs.blogs"), url: `${siteUrl}/${locale}/blogs` },
  ]);

  const initialBlogs = await getDbPublishedBlogs({ limit: 12 });

  const blogHubSchema = getBlogHubSchema({
    locale,
    totalPosts: initialBlogs.total,
    posts: initialBlogs.posts,
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, blogHubSchema]}
        id="blogs-index-breadcrumbs"
      />

      {/* 1. Common Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.blogs") },
        ]}
        title={t("title")}
        subtitle={t("subtitle")}
        align="left"
      />

      {/* 2. Filter Bar & Articles Grid inside Suspense for Dynamic SearchParams */}
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogListingSection searchParams={searchParams} locale={locale} />
      </Suspense>

      {/* 3. Common CTA Block */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title="Need Your Smartphone Repaired Today?"
            subtitle="Get same-day doorstep pickup across Pune with certified ESD-safe lab repairs and 100% data privacy."
          />
        </Container>
      </Section>
    </div>
  );
}
