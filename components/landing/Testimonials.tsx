"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckCircle2, Star, Smartphone, Wrench, Play, Pause } from "lucide-react";
import { SectionHeader } from "@/components/ui";

interface TestimonialDefinition {
  id: string;
  prefix: "t1" | "t2" | "t3";
  initials: string;
  rating: number;
  videoSrc: string;
  posterSrc: string;
}

const TESTIMONIAL_ITEMS: TestimonialDefinition[] = [
  {
    id: "redmi-note-8",
    prefix: "t1",
    initials: "AK",
    rating: 5,
    videoSrc: "/assets/videos/repair.mp4",
    posterSrc: "/logo.png",
  },
  {
    id: "redmi-13c-5g",
    prefix: "t2",
    initials: "PD",
    rating: 5,
    videoSrc: "/assets/videos/repair2.mp4",
    posterSrc: "/logo.png",
  },
  {
    id: "redmi-9-power",
    prefix: "t3",
    initials: "RB",
    rating: 5,
    videoSrc: "/assets/videos/repair3.mp4",
    posterSrc: "/logo.png",
  },
];

interface RepairVideoPlayerProps {
  videoSrc: string;
  posterSrc: string;
  deviceModel: string;
  playLabel: string;
  pauseLabel: string;
}

function RepairVideoPlayer({
  videoSrc,
  posterSrc,
  deviceModel,
  playLabel,
  pauseLabel,
}: RepairVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            // Auto pause if user scrolls away while video is playing
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { rootMargin: "150px", threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);

    if (!isInView) {
      setIsInView(true);
      setIsPlaying(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      });
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleTogglePlay}
      className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-tech-slate/95 border border-border-default/80 flex items-center justify-center shadow-2xs group/video select-none cursor-pointer"
    >
      {/* Video element - NO controls, muted attribute, playsInline */}
      {isInView && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          preload="none"
          playsInline
          muted
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
            }
          }}
          className="h-full w-full object-cover"
        />
      )}

      {/* Poster image preview (before first playback) */}
      {!hasInteracted && (
        <Image
          src={posterSrc}
          alt={`${deviceModel} repair video`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover/video:scale-105 transition-transform duration-500 pointer-events-none"
        />
      )}

      {/* Subtle hover overlay */}
      <div
        className={`absolute inset-0 bg-tech-slate/15 transition-opacity duration-300 pointer-events-none ${
          isPlaying ? "opacity-0 group-hover/video:opacity-100" : "opacity-0 group-hover/video:opacity-40"
        }`}
      />

      {/* Center Play / Pause Button */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <button
          type="button"
          aria-label={isPlaying ? pauseLabel : playLabel}
          className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 active:scale-95 ${
            isPlaying
              ? "bg-tech-slate/80 text-clean-white backdrop-blur-xs ring-2 ring-clean-white/25 opacity-0 group-hover/video:opacity-100 group-hover/video:scale-110"
              : "bg-flash-orange text-clean-white ring-4 ring-flash-orange/30 scale-100 group-hover/video:scale-110"
          }`}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-clean-white border-b border-border-default">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          title={t("title")}
          subtitle={t("reviewsCount")}
          className="mb-10 sm:mb-14"
        />

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIAL_ITEMS.map((item) => {
            const name = t(`${item.prefix}Name`);
            const role = t(`${item.prefix}Role`);
            const area = t(`${item.prefix}Area`);
            const deviceModel = t(`${item.prefix}Device`);
            const serviceType = t(`${item.prefix}Service`);
            const quote = t(`${item.prefix}Text`);

            return (
              <div
                key={item.id}
                className="relative rounded-2xl bg-mist-gray/60 border border-border-default p-5 sm:p-6 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-flash-orange/40 transition-all group"
              >
                <div>
                  {/* Real Lab Repair Video Player */}
                  <RepairVideoPlayer
                    videoSrc={item.videoSrc}
                    posterSrc={item.posterSrc}
                    deviceModel={deviceModel}
                    playLabel={t("playVideo")}
                    pauseLabel={t("pauseVideo")}
                  />

                  {/* Device & Service Tag Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-clean-white px-2.5 py-1 text-2xs font-bold text-tech-slate border border-border-default shadow-2xs">
                      <Smartphone className="h-3 w-3 text-flash-orange" />
                      {deviceModel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-clean-white px-2 py-1 text-2xs font-medium text-text-secondary border border-border-default shadow-2xs">
                      <Wrench className="h-2.5 w-2.5 text-electric-amber" />
                      {serviceType}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mb-2.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-electric-amber text-electric-amber"
                      />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-xs sm:text-sm text-text-secondary font-body leading-relaxed mb-4">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>

                {/* Customer Info Footer */}
                <div className="pt-3.5 border-t border-border-default/80 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tech-slate text-clean-white font-heading font-extrabold text-xs shrink-0 shadow-2xs">
                    {item.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-heading text-xs sm:text-sm font-bold text-tech-slate">
                        {name}
                      </h3>
                      <CheckCircle2 className="h-3.5 w-3.5 text-flash-orange" />
                    </div>
                    <p className="text-[11px] text-text-muted font-medium leading-tight">
                      {role} • {area}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
