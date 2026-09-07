"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/landing/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/Skeleton";

interface BlogPostItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  readingTimeMinutes?: number;
  publishedAt?: string;
  category?: string;
}

export default function BlogHighlights() {
  const t = useTranslations("BlogSection");
  const tCommon = useTranslations("Common");

  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBlogs() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/blogs?limit=3");
        const data = await res.json();
        if (data.success && Array.isArray(data.data?.posts)) {
          setPosts(data.data.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to load blog highlights", err);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-clean-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-8 sm:mb-12"
        />

        {/* Dynamic Content */}
        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : posts.length === 0 ? (
          <div className="mx-auto max-w-2xl">
            <EmptyState
              icon={BookOpen}
              title={tCommon("emptyState.noBlogsTitle")}
              description={tCommon("emptyState.noBlogsDesc")}
            />
          </div>
        ) : (
          /* Blog Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
            {posts.map((post) => (
              <article
                key={post._id}
                className="flex flex-col justify-between rounded-2xl bg-mist-gray/80 border border-zinc-200 p-5 sm:p-6 shadow-2xs hover:shadow-lg hover:border-flash-orange/40 transition-all group"
              >
                <div>
                  {/* 16:9 Image or Graphic */}
                  <div className="relative mb-4 aspect-16/9 w-full overflow-hidden rounded-xl bg-gradient-to-br from-mist-gray to-zinc-200 flex items-center justify-center border border-zinc-100">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-clean-white text-flash-orange shadow-xs group-hover:scale-110 transition-transform">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-2">
                    <span className="rounded-md bg-clean-white px-2.5 py-0.5 text-tech-slate border border-zinc-200">
                      {post.category || "Repair Guide"}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3 text-flash-orange" />
                      {post.readingTimeMinutes || 4} {t("readTime")}
                    </span>
                  </div>

                  <h3 className="font-heading text-base sm:text-lg font-bold text-tech-slate group-hover:text-flash-orange transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 font-body line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-200/80">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold text-flash-orange group-hover:translate-x-1 transition-transform"
                  >
                    <span>{t("readMore")}</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
