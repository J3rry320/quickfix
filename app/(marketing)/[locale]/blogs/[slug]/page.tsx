import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import JsonLd from "@/components/seo/JsonLd";
import { Badge, Container, CTABlock, PageHero, Section } from "@/components/ui";
import { getBlogPostSchema, getBreadcrumbSchema } from "@/config/jsonld";
import { siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getDbBlogPostBySlug, getStaticBlogSlugs } from "@/lib/db/blogs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Tag,
  User,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { cacheLife, cacheTag } from "next/cache";

export async function generateStaticParams() {
  const slugs = await getStaticBlogSlugs();
  const validSlugs = slugs.length > 0 ? slugs : ["doorstep-mobile-repair-pune"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of validSlugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  "use cache";
  cacheLife("days");

  const { locale, slug } = await params;
  const post = await getDbBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | QuickFixMobile.in",
    };
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/${locale}/blogs/${post.slug}`;
  const metaTitle = post.seo?.metaTitle || `${post.title} | QuickFixMobile.in`;
  const metaDescription = post.seo?.metaDescription || post.excerpt;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: post.seo?.keywords?.length ? post.seo.keywords : post.tags,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/en/blogs/${post.slug}`,
        hi: `${siteUrl}/hi/blogs/${post.slug}`,
        mr: `${siteUrl}/mr/blogs/${post.slug}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      modifiedTime: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : undefined,
      authors: [post.author?.name || "QuickFix Tech Team"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  "use cache";
  cacheLife("days");

  const { locale, slug } = await params;
  cacheTag("blogs", `blog-${slug}`);

  const post = await getDbBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Articles & Guides", url: `${siteUrl}/${locale}/blogs` },
    { name: post.title, url: `${siteUrl}/${locale}/blogs/${post.slug}` },
  ]);

  const blogPostSchema = getBlogPostSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author?.name || "QuickFix Tech Team",
    locale,
  });

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
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, blogPostSchema]}
        id={`blog-${post.slug}-structured-data`}
      />

      {/* 1. Common Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blogs & Guides", href: "/blogs" },
          { label: post.title },
        ]}
        title={post.title}
        subtitle={post.excerpt}
        align="left"
        highlights={[
          {
            icon: User,
            label: "Author",
            value: post.author?.name || "QuickFix Tech Team",
            color: "text-flash-orange",
          },
          {
            icon: Calendar,
            label: "Published",
            value: formattedDate,
            color: "text-blue-500",
          },
          {
            icon: Clock,
            label: "Read Time",
            value: `${post.readingTimeMinutes || 5} min read`,
            color: "text-emerald-500",
          },
          {
            icon: Tag,
            label: "Category",
            value: post.category,
            color: "text-purple-500",
          },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 rounded-xl bg-clean-white px-4 py-2 text-xs font-bold text-tech-slate border border-border-default shadow-2xs hover:border-flash-orange/40 transition-all"
            >
              <ArrowLeft className="h-4 w-4 text-flash-orange" />
              <span>Back to Articles</span>
            </Link>
            <Badge variant="accent" size="md">
              {post.category}
            </Badge>
          </div>
        }
      />

      {/* 2. Main Blog Body */}
      <Section variant="white" padding="default">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Guarantee Callout Banner */}
            <div className="mb-10 flex items-center justify-between flex-wrap gap-4 rounded-2xl bg-mist-gray/80 border border-border-default p-4 sm:p-5 text-xs text-tech-slate shadow-2xs">
              <div className="flex items-center gap-2.5 font-bold">
                <ShieldCheck className="h-5 w-5 text-flash-orange shrink-0" />
                <span>
                  QuickFix Pune Express: Same-day doorstep pickup & certified
                  lab repair with 90-day warranty.
                </span>
              </div>
              <Link
                href="/book-repair"
                className="inline-flex items-center gap-1.5 font-bold text-flash-orange hover:text-flash-orange-hover transition-colors"
              >
                <span>Book Doorstep Pickup</span>
                <Wrench className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Markdown Content Parsed on Client */}
            <MarkdownRenderer content={post.content} />

            {/* Tags Footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border-default">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-flash-orange" />
                  <span>Related Topics & Tags</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <Badge key={idx} variant="default" size="sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 3. Reusable Common CTA Section */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title="Having Issues With Your Smartphone in Pune?"
            subtitle="Don't leave your phone at risky market stalls. Book same-day doorstep pickup across Pune with certified ESD-safe lab repairs and 100% data privacy."
          />
        </Container>
      </Section>
    </div>
  );
}
