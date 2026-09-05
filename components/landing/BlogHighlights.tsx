"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, Clock } from "lucide-react";
import MediaPlaceholder from "./MediaPlaceholder";
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
    <section className="py-16 lg:py-24 bg-clean-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              {t("badge")}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-tech-slate tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-2 text-base sm:text-lg text-zinc-600 font-body max-w-2xl">
              {t("subtitle")}
            </p>
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <article
                key={post._id}
                className="flex flex-col justify-between rounded-2xl bg-mist-gray border border-zinc-200 p-5 sm:p-6 shadow-xs hover:shadow-lg hover:border-flash-orange/40 transition-all group"
              >
                <div>
                  {/* 16:9 Image Placeholder */}
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <MediaPlaceholder
                      src={post.coverImage}
                      alt={post.title}
                      aspectRatio="16/9"
                      type="image"
                      badge={t("mediaBadge")}
                      label={post.title}
                    />
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
                  <span className="inline-flex items-center text-xs font-bold text-flash-orange group-hover:translate-x-1 transition-transform">
                    {t("readMore")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
