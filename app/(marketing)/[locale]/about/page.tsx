import TrustBadges from "@/components/landing/TrustBadges";
import DoorstepPickupAssurance from "@/components/landing/DoorstepPickupAssurance";
import JsonLd from "@/components/seo/JsonLd";
import {
  AspectBox,
  Container,
  CTABlock,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui";
import contactConfig from "@/config/contact";
import { getAboutPageSchema, getBreadcrumbSchema } from "@/config/jsonld";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Cpu,
  Eye,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import Image from "next/image";

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
  "use cache";
  cacheLife("max");

  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "AboutPage" });

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const aboutSchema = getAboutPageSchema(locale);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "About QuickFix", url: `${siteUrl}/${locale}/about` },
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
      color: "bg-info-light text-info",
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
      color: "bg-success-light text-success",
    },
    {
      icon: Cpu,
      title: t("pillar4Title"),
      desc: t("pillar4Desc"),
      color: "bg-electric-amber/10 text-electric-amber",
    },
  ];

  const standards = [
    {
      icon: Cpu,
      title: t("standard1Title"),
      desc: t("standard1Desc"),
    },
    {
      icon: Wrench,
      title: t("standard2Title"),
      desc: t("standard2Desc"),
    },
    {
      icon: ShieldCheck,
      title: t("standard3Title"),
      desc: t("standard3Desc"),
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-clean-white">
      <JsonLd
        schema={[aboutSchema, breadcrumbSchema]}
        id="about-structured-data"
      />

      {/* 1. Unified Page Hero (Clean, punchy without redundant pill clutter) */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About QuickFix" },
        ]}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        align="center"
        actions={
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/book-repair"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg shadow-flash-orange/20 hover:bg-flash-orange-hover active:scale-95 transition-all cursor-pointer"
            >
              <span>Schedule a Repair</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>Call Helpline: {contactConfig.phone.display}</span>
            </a>
          </div>
        }
      />

      {/* 2. Key Metrics Strip */}
      <Section variant="white" padding="tight">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-clean-white border border-border-default p-4 sm:p-6 shadow-xs hover:border-flash-orange/50 hover:shadow-md transition-all text-center group"
                >
                  <div className="mx-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <p className="font-heading text-2xl sm:text-3xl font-black text-tech-slate tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-text-muted font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 3. The QuickFix Story & Origin (Streamlined & visually elevated) */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Visual Media Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl overflow-hidden border border-border-default shadow-lg group bg-tech-slate">
                <Image
                  src="/assets/images/about.webp"
                  alt="QuickFix Sadashiv Peth Lab"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Top Location Chip */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tech-slate/90 backdrop-blur-md text-clean-white text-[11px] font-bold border border-clean-white/20 shadow-md">
                    <MapPin className="h-3.5 w-3.5 text-flash-orange" />
                    Sadashiv Peth Central Lab
                  </span>
                </div>

                {/* Bottom subtle caption bar */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tech-slate/90 via-tech-slate/50 to-transparent p-4 sm:p-5 text-clean-white pointer-events-none">
                  <p className="font-heading font-bold text-xs sm:text-sm">
                    QuickFix Central Operations & Lab
                  </p>
                  <p className="text-clean-white/80 text-[11px] mt-0.5 line-clamp-1">
                    Shop No. 3, Purva Plaza, Sadashiv Peth, Pune
                  </p>
                </div>
              </div>
            </div>

            {/* Story Text: Concise & Scannable */}
            <div className="lg:col-span-7">
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-flash-orange/10 px-3 py-1 text-xs font-bold text-flash-orange border border-flash-orange/20">
                  <Zap className="h-3 w-3" />
                  Our Story
                </span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tech-slate tracking-tight">
                {t("storyTitle")}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm md:text-base text-text-muted font-medium leading-relaxed">
                {t("storySubtitle")}
              </p>

              {/* Punchy 2-paragraph narrative */}
              <div className="mt-4 space-y-3 text-xs sm:text-sm text-text-secondary font-body leading-relaxed">
                <p>{t("storyP1")}</p>
                <p>{t("storyP2")}</p>
              </div>

              {/* Highlight Badges */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-clean-white px-3 py-1.5 text-2xs sm:text-xs font-bold text-tech-slate border border-border-default shadow-2xs">
                  <Clock className="h-3.5 w-3.5 text-flash-orange" />
                  {t("storyBadge1")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-clean-white px-3 py-1.5 text-2xs sm:text-xs font-bold text-tech-slate border border-border-default shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  {t("storyBadge2")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-clean-white px-3 py-1.5 text-2xs sm:text-xs font-bold text-tech-slate border border-border-default shadow-2xs">
                  <Wrench className="h-3.5 w-3.5 text-electric-amber" />
                  {t("storyBadge3")}
                </span>
              </div>

              {/* Guarantees Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-5 border-t border-border-default">
                {[
                  t("guarantee1"),
                  t("guarantee2"),
                  t("guarantee3"),
                  t("guarantee4"),
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl bg-clean-white border border-border-default p-2.5 shadow-2xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <span className="text-xs font-semibold text-tech-slate">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. The 4 Pillars of Doorstep Service */}
      <Section variant="white" padding="default">
        <Container>
          <SectionHeader
            title={t("pillarsTitle")}
            subtitle={t("pillarsSubtitle")}
            className="mb-8 sm:mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-clean-white border border-border-default p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-flash-orange/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 text-xs font-mono font-bold text-border-strong group-hover:text-flash-orange/60 transition-colors select-none">
                    0{i + 1}
                  </div>
                  <div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform ${pillar.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-tech-slate mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-text-secondary font-body leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5. Pune Diagnostics Lab & Quality Assurance Standards */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <SectionHeader
                title={t("standardsTitle")}
                subtitle={t("standardsSubtitle")}
                align="left"
                className="mb-6"
              />

              {/* 3 Structured Feature Cards instead of text walls */}
              <div className="space-y-3">
                {standards.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-clean-white border border-border-default shadow-2xs hover:border-flash-orange/40 transition-colors"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange mt-0.5">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-tech-slate">
                          {item.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5">
              <AspectBox
                aspectRatio="1/1"
                variant="dashed"
                src="/assets/images/landing.webp"
                fallbackType="service"
                title="ESD-Safe Testing Station"
                label="Calibrated logic board analysis, thermal profiling & OEM part pre-screening"
                className="shadow-md"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 5.5 Cleanroom Lab & Precision Micro-Soldering in Action */}
      <DoorstepPickupAssurance
        variant="section"
        videoSrc="/assets/videos/quickfixabout.mp4"
        posterSrc="/logo.png"
        badge="Sadashiv Peth Lab Footage"
      />

      {/* 6. Founder Spotlight: Editorial Vision & Pledge (Media-free, high-contrast) */}
      <Section variant="white" padding="default">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-3xl bg-tech-slate-dark text-clean-white p-7 sm:p-10 lg:p-12 shadow-2xl border border-border-dark overflow-hidden">
              {/* Vibrant Ambient Glow Accents */}
              <div
                className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-flash-orange/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-electric-amber/15 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10">
                {/* Eyebrow Header Bar */}
                <div className="pb-6 border-b border-clean-white/15">
                  <div className="inline-flex items-center gap-2 rounded-full bg-flash-orange/15 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-flash-orange border border-flash-orange/30">
                    <Award className="h-4 w-4 text-flash-orange" />
                    <span>{t("founderTitle")}</span>
                  </div>
                </div>

                {/* Hero Editorial Pull-Quote with Bold Orange Border */}
                <div className="relative pl-5 sm:pl-7 border-l-4 border-flash-orange my-7 sm:my-9">
                  <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-flash-orange mb-3" />
                  <blockquote className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-clean-white leading-snug tracking-tight">
                    &ldquo;{t("founderQuote")}&rdquo;
                  </blockquote>
                </div>

                {/* Founder Bio: High-Contrast Crisp Body */}
                <p className="text-sm sm:text-base text-clean-white/95 font-body leading-relaxed max-w-3xl">
                  {t("founderBio")}
                </p>

                {/* Founder Attribution Bar */}
                <div className="mt-8 pt-6 border-t border-clean-white/15">
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-clean-white tracking-tight">
                    {t("founderName")}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-electric-amber mt-0.5">
                    {t("founderRole")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. Guarantees Strip */}
      <TrustBadges variant="surface" />

      {/* 8. Reusable Bottom CTA */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock title={t("ctaTitle")} subtitle={t("ctaSubtitle")} />
        </Container>
      </Section>
    </div>
  );
}
