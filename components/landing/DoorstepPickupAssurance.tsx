"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileCheck2,
  PackageCheck,
  Truck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

interface DoorstepPickupAssuranceProps {
  className?: string;
  variant?: "card" | "section";
  showCta?: boolean;
}

export default function DoorstepPickupAssurance({
  className = "",
  variant = "card",
  showCta = true,
}: DoorstepPickupAssuranceProps) {
  const t = useTranslations("DoorstepAssurance");

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasLoaded(true);
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                setIsPlaying(false);
              });
          }
        } else {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (!hasLoaded) setHasLoaded(true);

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const cardContent = (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-clean-white p-6 sm:p-8 lg:p-10 text-tech-slate shadow-xl border border-border-default">
      {/* Subtle Background Theme Ambient Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-flash-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-electric-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Descriptive Assurance Content */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
          {/* Heading */}
          <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-tech-slate tracking-tight leading-tight">
            {t("title")}
          </h3>

          {/* Subtitle */}
          <p className="mt-3 text-xs sm:text-sm lg:text-base text-text-secondary font-body leading-relaxed max-w-2xl">
            {t("subtitle")}
          </p>

          {/* Trust Points Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-border-default">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-tech-slate">
              <ShieldCheck className="h-4.5 w-4.5 text-success-green shrink-0" />
              <span>{t("trustPoint1")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-tech-slate">
              <PackageCheck className="h-4.5 w-4.5 text-flash-orange shrink-0" />
              <span>{t("trustPoint2")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-tech-slate">
              <FileCheck2 className="h-4.5 w-4.5 text-flash-orange shrink-0" />
              <span>{t("trustPoint3")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-tech-slate">
              <Truck className="h-4.5 w-4.5 text-electric-amber shrink-0" />
              <span>{t("trustPoint4")}</span>
            </div>
          </div>

          {/* CTA Action */}
          {showCta && (
            <div className="mt-8">
              <Link
                href="/book-repair"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-flash-orange px-7 py-3.5 text-xs sm:text-sm font-extrabold text-clean-white shadow-lg shadow-flash-orange/20 hover:bg-flash-orange-hover active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{t("cta")}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Responsive 9:16 Vertical Video Player */}
        <div className="lg:col-span-5 xl:col-span-4 w-full flex justify-center">
          <div
            ref={containerRef}
            onClick={togglePlay}
            className="relative aspect-[9/16] w-full max-w-[220px] sm:max-w-[250px] md:max-w-[270px] rounded-[28px] sm:rounded-[34px] bg-tech-slate border-2 border-border-default shadow-2xl overflow-hidden group select-none transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
          >
            {/* Minimal Smartphone Notch */}
            <div className="pointer-events-none absolute top-2.5 inset-x-0 z-20 flex justify-center">
              <div className="h-3 w-16 sm:w-20 rounded-full bg-tech-slate-dark/80 backdrop-blur-md border border-clean-white/15" />
            </div>

            {/* Video Element */}
            <video
              ref={videoRef}
              src={hasLoaded ? "/assets/videos/QuickFIxLanding.mp4" : undefined}
              preload={hasLoaded ? "auto" : "none"}
              muted={isMuted}
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />


            {/* Bottom Floating Controls: Mute Toggle */}
            <div className="absolute bottom-3 right-3 z-20">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-tech-slate-dark/80 backdrop-blur-md text-clean-white border border-clean-white/20 hover:bg-tech-slate-dark transition-colors shadow-md"
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-flash-orange" />
                )}
              </button>
            </div>

            {/* Center Play / Pause Indicator */}
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center bg-tech-slate-dark/40 transition-opacity duration-300 ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-flash-orange/90 text-clean-white shadow-xl shadow-flash-orange/40 hover:scale-110 transition-transform">
                {isPlaying ? (
                  <Pause className="h-6 w-6 sm:h-7 sm:w-7 fill-current" />
                ) : (
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current ml-1" />
                )}
              </div>
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="pointer-events-none absolute bottom-2 inset-x-0 z-20 flex justify-center">
              <div className="h-1 w-20 sm:w-24 rounded-full bg-clean-white/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === "section") {
    return (
      <section className={`py-10 sm:py-16 bg-clean-white ${className}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {cardContent}
        </div>
      </section>
    );
  }

  return <div className={className}>{cardContent}</div>;
}
