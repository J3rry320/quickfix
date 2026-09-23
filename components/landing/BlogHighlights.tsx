"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { EmptyState, Badge, AspectBox } from "@/components/ui";

export interface BlogPostHighlightItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  readingTimeMinutes?: number;
  publishedAt?: string | Date;
  category?: string;
}

interface BlogHighlightsProps {
  initialPosts?: BlogPostHighlightItem[];
}

export default function BlogHighlights({ initialPosts }: BlogHighlightsProps) {
  const t = useTranslations("BlogSection");
  const tCommon = useTranslations("Common");

  const [posts, setPosts] = useState<BlogPostHighlightItem[]>(
    initialPosts && initialPosts.length > 0 ? initialPosts : []
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    !initialPosts || initialPosts.length === 0
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) return;

    let isMounted = true;
    async function loadBlogs() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/blogs?limit=12");
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data?.posts)) {
          setPosts(data.data.posts);
        }
      } catch (err) {
        console.error("Failed to load blog highlights", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadBlogs();

    return () => {
      isMounted = false;
    };
  }, [initialPosts]);

  // Update scroll buttons state
  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons, { passive: true });
      window.addEventListener("resize", updateScrollButtons);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", updateScrollButtons);
      }
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [posts]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollOffset = direction === "left" ? -340 : 340;
    el.scrollBy({ left: scrollOffset, behavior: "smooth" });
  };

  return (
    <section
      id="blog-highlights"
      className="py-10 sm:py-16 lg:py-20 bg-clean-white border-b border-border-default"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <div className="mb-2.5">
              <Badge variant="accent" size="sm">
                {t("badge")}
              </Badge>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-secondary font-body leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Desktop Left / Right Scroll Navigation */}
          {posts.length > 0 && !isLoading && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`p-2.5 rounded-xl border transition-all ${
                  canScrollLeft
                    ? "bg-clean-white border-border-default text-tech-slate hover:border-flash-orange hover:text-flash-orange shadow-2xs cursor-pointer active:scale-95"
                    : "bg-mist-gray/60 border-border-default/40 text-text-muted cursor-not-allowed opacity-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`p-2.5 rounded-xl border transition-all ${
                  canScrollRight
                    ? "bg-clean-white border-border-default text-tech-slate hover:border-flash-orange hover:text-flash-orange shadow-2xs cursor-pointer active:scale-95"
                    : "bg-mist-gray/60 border-border-default/40 text-text-muted cursor-not-allowed opacity-50"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Horizontal Scroll Content */}
        {isLoading ? (
          <div className="flex gap-5 sm:gap-6 overflow-hidden py-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 h-80 rounded-2xl border border-border-default bg-elevated-surface p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-40 w-full rounded-xl bg-mist-gray" />
                  <div className="h-4 w-20 rounded bg-surface-hover" />
                  <div className="h-5 w-3/4 rounded bg-surface-hover" />
                  <div className="h-10 w-full rounded bg-mist-gray" />
                </div>
                <div className="h-4 w-1/3 rounded bg-surface-hover" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="mx-auto max-w-2xl py-8">
            <EmptyState
              icon={BookOpen}
              title={tCommon("emptyState.noBlogsTitle")}
              description={tCommon("emptyState.noBlogsDesc")}
            />
          </div>
        ) : (
          /* Horizontal Scroller Container */
          <div
            ref={scrollContainerRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {posts.map((post) => (
              <article
                key={post._id}
                className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start flex flex-col justify-between rounded-2xl bg-mist-gray/80 border border-border-default p-5 sm:p-6 shadow-2xs hover:shadow-lg hover:border-flash-orange/40 transition-all group"
              >
                <div>
                  {/* 16:9 Image or Fallback */}
                  <Link href={`/blogs/${post.slug}`} className="block">
                    <AspectBox
                      aspectRatio="16/9"
                      src={post.coverImage}
                      alt={post.title}
                      fallbackType="blog"
                      className="mb-4 rounded-xl"
                      sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 350px"
                    />
                  </Link>

                  <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-2">
                    <span className="rounded-md bg-clean-white px-2.5 py-0.5 text-tech-slate border border-border-default text-2xs font-bold">
                      {post.category || "Repair Guide"}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-2xs">
                      <Clock className="h-3 w-3 text-flash-orange" />
                      {post.readingTimeMinutes || 4} {t("readTime")}
                    </span>
                  </div>

                  <h3 className="font-heading text-base sm:text-lg font-bold text-tech-slate group-hover:text-flash-orange transition-colors line-clamp-2 mb-2">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-text-secondary font-body line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-border-default/80">
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

        {!isLoading && posts.length > 0 && (
          <div className="mt-8 sm:mt-10 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-mist-gray border border-border-strong px-6 py-3 text-xs sm:text-sm font-bold text-tech-slate hover:border-flash-orange hover:text-flash-orange hover:bg-clean-white transition-all shadow-2xs"
            >
              <span>{t("viewAll")}</span>
              <ArrowRight className="h-4 w-4 text-flash-orange" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
