"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  AspectBox,
  EmptyState,
} from "@/components/ui";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { DbBlogPostItem } from "@/lib/db/blogs";

interface BlogInfiniteGridProps {
  initialPosts: DbBlogPostItem[];
  initialHasMore: boolean;
  initialPage?: number;
  total?: number;
  category?: string;
  search?: string;
  locale: string;
}

export default function BlogInfiniteGrid({
  initialPosts,
  initialHasMore,
  initialPage = 1,
  total = 0,
  category = "All",
  search = "",
  locale = "en",
}: BlogInfiniteGridProps) {
  const [posts, setPosts] = useState<DbBlogPostItem[]>(initialPosts);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const fetchNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    setErrorMessage(null);

    const nextPage = page + 1;
    const params = new URLSearchParams({
      page: nextPage.toString(),
      limit: "9",
    });

    if (category && category !== "All") {
      params.set("category", category);
    }
    if (search && search.trim()) {
      params.set("search", search.trim());
    }

    try {
      const response = await fetch(`/api/blogs?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data.posts)) {
        const newPosts: DbBlogPostItem[] = result.data.posts;
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p._id));
          return [...prev, ...uniqueNewPosts];
        });

        const moreAvailable = Boolean(result.data.pagination?.hasMore);
        setHasMore(moreAvailable);
        setPage(nextPage);
      } else {
        throw new Error(result.error?.message || "Failed to load more blogs");
      }
    } catch (err: unknown) {
      console.error("Error loading more blog posts:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load additional articles"
      );
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, page, category, search]);

  // Set up IntersectionObserver on sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetchingRef.current && hasMore) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "300px 0px", // Trigger 300px before the user hits the bottom
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, fetchNextPage]);

  if (posts.length === 0 && !isLoadingMore) {
    return (
      <div className="mx-auto max-w-xl py-12">
        <EmptyState
          icon={BookOpen}
          title="No Articles Found"
          description={
            search
              ? `No articles matched your search "${search}". Try different keywords or reset filters.`
              : "There are currently no published articles in this category. Check back soon for new guides!"
          }
          actionLabel="View All Articles"
          actionHref="/blogs"
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => {
          const dateLocale =
            locale === "hi" ? "hi-IN" : locale === "mr" ? "mr-IN" : "en-IN";
          const formattedDate = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : new Date(post.createdAt).toLocaleDateString(dateLocale, {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

          return (
            <Card
              key={post._id}
              hoverable
              className="group overflow-hidden flex flex-col justify-between"
            >
              <div>
                <Link href={`/blogs/${post.slug}`} className="block">
                  <AspectBox
                    aspectRatio="16/9"
                    src={post.coverImage}
                    alt={post.title}
                    fallbackType="blog"
                    className="rounded-b-none border-0 border-b border-border-default/60"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                  />
                </Link>
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

                <CardContent className="flex-1 pb-4">
                  <CardDescription className="line-clamp-3 mb-4">
                    {post.excerpt}
                  </CardDescription>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="default" size="sm">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>

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

      {/* Incremental Loading Skeleton (3 cards) */}
      {isLoadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl border border-border-default bg-elevated-surface p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-40 w-full rounded-xl bg-mist-gray" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 w-20 rounded-full bg-surface-hover" />
                  <div className="h-4 w-16 rounded bg-surface-hover" />
                </div>
                <div className="h-6 w-3/4 rounded bg-surface-hover" />
                <div className="h-12 w-full rounded bg-mist-gray" />
              </div>
              <div className="h-4 w-1/3 rounded bg-surface-hover mt-3" />
            </div>
          ))}
        </div>
      )}

      {/* Error / Retry Bar */}
      {errorMessage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-red-50/80 border border-red-200 text-red-700 text-sm">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-clean-white font-semibold text-xs hover:bg-red-700 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Intersection Observer Sentinel Element */}
      {hasMore && !errorMessage && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="h-12 w-full flex items-center justify-center text-text-muted text-xs"
        >
          <span className="sr-only">Loading more articles...</span>
        </div>
      )}

      {/* Completion Banner when all blogs are loaded */}
      {!hasMore && posts.length > 0 && (
        <div className="mt-12 py-8 px-6 rounded-2xl bg-mist-gray/60 border border-border-default text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-clean-white border border-border-default text-success shadow-2xs mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="font-heading text-base font-bold text-tech-slate">
            All Guides & Tutorials Loaded
          </p>
          <p className="text-xs sm:text-sm text-text-secondary">
            You have explored all {total || posts.length} smartphone troubleshooting and repair articles. Need urgent doorstep assistance in Pune?
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-flash-orange text-clean-white font-bold text-xs hover:bg-flash-orange-hover transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Doorstep Repair</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
