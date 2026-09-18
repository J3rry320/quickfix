import JsonLd from "@/components/seo/JsonLd";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  CTABlock,
  EmptyState,
  PageHero,
  Section,
} from "@/components/ui";
import { getBreadcrumbSchema } from "@/config/jsonld";
import { siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getDbBlogCategories, getDbPublishedBlogs } from "@/lib/db/blogs";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

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
    title:
      "Smartphone Repair Guides, Battery & Screen Tips | QuickFixMobile.in Pune",
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
      title: "Smartphone Repair Guides & Tips | QuickFixMobile.in Pune",
      description:
        "Comprehensive guides and troubleshooting advice from certified technicians. Same-day doorstep pickup and lab repair across Pune.",
      url: `${siteUrl}/${locale}/blogs`,
      type: "website",
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
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const { category, search, page } = await searchParams;

  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const activeCategory = category || "All";

  const [blogData, categories] = await Promise.all([
    getDbPublishedBlogs({
      category: activeCategory,
      search,
      page: currentPage,
      limit: 12,
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

        {/* Posts Grid using Common Card & Badge Components */}
        {blogData.posts.length === 0 ? (
          <div className="mx-auto max-w-xl py-12">
            <EmptyState
              icon={BookOpen}
              title="No Articles Found"
              description="There are currently no published articles matching this category. Please check back shortly."
              actionLabel="View All Articles"
              actionHref="/blogs"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogData.posts.map((post) => {
              const formattedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

              return (
                <Card key={post._id} hoverable className="group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="accent" size="sm">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-2xs font-semibold text-text-muted">
                        <Clock className="h-3 w-3 text-flash-orange" />
                        <span>{post.readingTimeMinutes || 4} min read</span>
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-flash-orange transition-colors line-clamp-2 text-base sm:text-lg">
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 pb-4 flex flex-col justify-between">
                    <CardDescription className="line-clamp-3 mb-4">
                      {post.excerpt}
                    </CardDescription>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {post.tags.slice(0, 3).map((t, idx) => (
                          <Badge key={idx} variant="default" size="sm">
                            #{t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border-default/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-text-muted text-2xs">
                      <Calendar className="h-3 w-3" />
                      <span>{formattedDate}</span>
                    </div>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-flash-orange hover:text-flash-orange-hover hover:translate-x-0.5 transition-all"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
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
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Articles & Repair Guides", url: `${siteUrl}/${locale}/blogs` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={breadcrumbSchema} id="blogs-index-breadcrumbs" />

      {/* 1. Common Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blogs & Guides" },
        ]}
        title="Smartphone Repair Guides & Tech Tips"
        subtitle="In-depth articles from our Pune lab engineers covering battery degradation, display technologies, water damage rescue, and safe charging practices."
        align="center"
        highlights={[
          {
            icon: BookOpen,
            label: "Articles",
            value: "10+ Guides",
            color: "text-flash-orange",
          },
          {
            icon: Wrench,
            label: "Repairs",
            value: "Sadashiv Peth Lab",
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: "Data Safety",
            value: "Zero Access Policy",
            color: "text-success",
          },
          {
            icon: Zap,
            label: "Coverage",
            value: "All Pune & PCMC",
            color: "text-electric-amber",
          },
        ]}
      />

      {/* 2. Filter Bar & Articles Grid inside Suspense for Dynamic SearchParams */}
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogListingSection searchParams={searchParams} />
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
