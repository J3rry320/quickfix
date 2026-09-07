import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  ShieldCheck,
  Clock,
  Wrench,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
  Eye,
  Award,
  Zap,
  Navigation,
  Sparkles,
  Quote,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/landing/SectionHeader";
import TrustBadges from "@/components/landing/TrustBadges";
import JsonLd from "@/components/seo/JsonLd";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getAboutPageSchema, getBreadcrumbSchema } from "@/config/jsonld";
import contactConfig from "@/config/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({
    page: "about",
    locale,
    path: "/about",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "AboutPage" });

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const aboutSchema = getAboutPageSchema(locale);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("heroBadge") || "About Us", url: `${siteUrl}/${locale}/about` },
  ]);

  const stats = [
    {
      value: t("stats.devicesFixed"),
      label: t("stats.devicesFixedLabel"),
      icon: Wrench,
    },
    {
      value: t("stats.avgArrival"),
      label: t("stats.avgArrivalLabel"),
      icon: Clock,
    },
    {
      value: t("stats.warranty"),
      label: t("stats.warrantyLabel"),
      icon: ShieldCheck,
    },
    {
      value: t("stats.customerRating"),
      label: t("stats.customerRatingLabel"),
      icon: Award,
    },
  ];

  const pillars = [
    {
      icon: Eye,
      title: t("pillar1Title"),
      desc: t("pillar1Desc"),
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: Clock,
      title: t("pillar2Title"),
      desc: t("pillar2Desc"),
      color: "bg-flash-orange/10 text-flash-orange",
    },
    {
      icon: ShieldCheck,
      title: t("pillar3Title"),
      desc: t("pillar3Desc"),
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      icon: Sparkles,
      title: t("pillar4Title"),
      desc: t("pillar4Desc"),
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-clean-white">
      {/* Structured Data */}
      <JsonLd schema={[aboutSchema, breadcrumbSchema]} id="about-structured-data" />

      {/* 1. Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-24 bg-gradient-to-b from-mist-gray via-clean-white to-clean-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-tech-slate px-4 py-1.5 text-xs font-bold text-clean-white shadow-xs mb-6">
            <Sparkles className="h-3.5 w-3.5 text-electric-amber" />
            <span>{t("heroBadge")}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-tech-slate tracking-tight max-w-4xl mx-auto leading-tight">
            {t("heroTitle")}
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-zinc-600 font-body max-w-3xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Quick Metrics Ribbon */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-clean-white border border-zinc-200 p-5 sm:p-6 shadow-xs hover:border-flash-orange/50 hover:shadow-md transition-all text-center group"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. The QuickFix Story (Origin) */}
      <section className="py-12 sm:py-20 lg:py-24 bg-clean-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visual Box */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-mist-gray to-zinc-200 border border-zinc-200 p-8 shadow-lg overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="relative h-28 w-28 sm:h-36 sm:w-36 mb-6">
                  <Image
                    src="/logo.png"
                    alt="QuickFix.in Logo"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-tech-slate">
                  QuickFix<span className="text-flash-orange">.in</span>
                </h3>
                <p className="mt-2 text-xs font-semibold text-zinc-500">
                  {contactConfig.address.full}
                </p>

                {/* Floating Badge */}
                <div className="mt-6 w-full rounded-2xl bg-tech-slate text-clean-white p-4 shadow-md flex items-center gap-3 text-left">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flash-orange text-clean-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-electric-amber">
                      Central Dispatch Hub
                    </p>
                    <p className="text-2xs sm:text-xs text-zinc-300">
                      Sadashiv Peth • Serving all 35+ Pune pin codes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7">
              <SectionHeader
                title={t("storyTitle")}
                subtitle={t("storySubtitle")}
                align="left"
                className="mb-6"
              />

              <div className="space-y-4 text-xs sm:text-sm md:text-base text-zinc-600 font-body leading-relaxed">
                <p>{t("storyP1")}</p>
                <p>{t("storyP2")}</p>
                <p>{t("storyP3")}</p>
              </div>

              {/* Guarantees Bullet Points */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-zinc-100">
                {[
                  "No password or data wipe required",
                  "Watch the entire repair live in front of you",
                  "Pay only after inspecting touch & camera",
                  "90-Day warranty with free replacement",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-tech-slate">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Pillars of Doorstep Service */}
      <section className="py-12 sm:py-20 lg:py-24 bg-mist-gray/60 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t("pillarsTitle")}
            subtitle={t("pillarsSubtitle")}
            className="mb-10 sm:mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-clean-white border border-zinc-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-flash-orange/50 transition-all group"
                >
                  <div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform ${pillar.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 font-body leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Founder Spotlight */}
      <section className="py-12 sm:py-20 bg-clean-white border-b border-zinc-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-tech-slate text-clean-white p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-flash-orange text-clean-white shadow-lg font-heading text-3xl font-black">
                SP
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-electric-amber">
                  {t("founderTitle")}
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-clean-white mt-1">
                  {t("founderName")}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                  {t("founderRole")}
                </p>

                <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-body leading-relaxed">
                  {t("founderBio")}
                </p>

                {/* Quote Box */}
                <div className="mt-6 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 p-4 sm:p-5 flex items-start gap-3 text-left">
                  <Quote className="h-5 w-5 text-flash-orange shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-semibold italic text-clean-white leading-relaxed">
                    &ldquo;{t("founderQuote")}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pune Coverage Zones */}
      <section className="py-12 sm:py-20 bg-mist-gray/60 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t("zonesTitle")}
            subtitle={t("zonesSubtitle")}
            className="mb-10 sm:mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contactConfig.serviceAreas.zones.map((zone) => (
              <div
                key={zone.id}
                className="rounded-2xl bg-clean-white border border-zinc-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-flash-orange/50 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-flash-orange shrink-0" />
                      <h4 className="font-heading text-sm sm:text-base font-bold text-tech-slate">
                        {zone.name}
                      </h4>
                    </div>
                    <span className="rounded-full bg-flash-orange/10 px-2.5 py-0.5 text-[11px] font-extrabold text-flash-orange">
                      ⚡ {zone.dispatchTime}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {zone.areas.map((area, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-mist-gray px-2 py-1 text-2xs sm:text-xs font-medium text-zinc-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-2xs sm:text-xs text-zinc-500 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-flash-orange" />
                    Doorstep Available
                  </span>
                  <Link
                    href="/book-repair"
                    className="inline-flex items-center gap-1 text-flash-orange font-bold hover:underline"
                  >
                    <span>Book Repair</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Guarantees Strip */}
      <TrustBadges variant="surface" />

      {/* 7. Call To Action */}
      <section className="py-14 sm:py-20 bg-tech-slate text-clean-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/20 border border-flash-orange/30 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-flash-orange mb-4">
            <Zap className="h-3.5 w-3.5" />
            Pune Express Dispatch
          </span>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            {t("ctaTitle")}
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-zinc-400 font-body max-w-2xl mx-auto">
            {t("ctaSubtitle")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book-repair"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
            >
              <span>{t("ctaButton")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white text-tech-slate px-6 py-3.5 text-sm font-extrabold shadow-md hover:bg-zinc-100 active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>{t("ctaCall")}</span>
            </a>

            <a
              href={contactConfig.whatsapp.getDefaultUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-clean-white px-6 py-3.5 text-sm font-extrabold shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.19 1.564 5.946l-1.664 6.082 6.221-1.632c1.707.935 3.666 1.465 5.751 1.465 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
              </svg>
              <span>{t("ctaWhatsapp")}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
