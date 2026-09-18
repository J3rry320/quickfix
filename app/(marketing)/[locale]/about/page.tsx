import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  Quote,
  Cpu,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import TrustBadges from "@/components/landing/TrustBadges";
import JsonLd from "@/components/seo/JsonLd";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getAboutPageSchema, getBreadcrumbSchema } from "@/config/jsonld";
import contactConfig from "@/config/contact";
import { Container, Section, AspectBox, CTABlock, PageHero, SectionHeader } from "@/components/ui";

import { cacheLife } from "next/cache";

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

  return (
    <div className="flex flex-col w-full overflow-hidden bg-clean-white">
      <JsonLd schema={[aboutSchema, breadcrumbSchema]} id="about-structured-data" />

      {/* 1. Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About QuickFix" },
        ]}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        align="center"
        highlights={[
          {
            icon: Wrench,
            label: "Repairs",
            value: "10,000+",
            color: "text-flash-orange",
          },
          {
            icon: Clock,
            label: "Turnaround",
            value: "Same-Day",
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: "Warranty",
            value: "90 Days",
            color: "text-success",
          },
          {
            icon: MapPin,
            label: "Central Lab",
            value: "Sadashiv Peth",
            color: "text-electric-amber",
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/book-repair"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-flash-orange-hover active:scale-95 transition-all"
            >
              <span>Schedule a Repair</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-clean-white border border-border-default p-5 sm:p-6 shadow-xs hover:border-flash-orange/50 hover:shadow-md transition-all text-center group"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-text-muted font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 3. The QuickFix Story & Origin */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visual Media Box */}
            <div className="lg:col-span-5 relative">
              <AspectBox
                aspectRatio="4/3"
                variant="solid"
                badge="Central Pune Lab"
                fallbackType="lab"
                title="QuickFix HQ & Lab"
                label={`Sadashiv Peth Central Operations & Quality Lab — ${contactConfig.address.full}`}
                className="shadow-lg"
              />
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7">
              <SectionHeader
                title={t("storyTitle")}
                subtitle={t("storySubtitle")}
                align="left"
                className="mb-6"
              />

              <div className="space-y-4 text-xs sm:text-sm md:text-base text-text-secondary font-body leading-relaxed">
                <p>{t("storyP1")}</p>
                <p>{t("storyP2")}</p>
                <p>{t("storyP3")}</p>
              </div>

              {/* Guarantees Bullet Points */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-border-default/80">
                {[
                  t("guarantee1"),
                  t("guarantee2"),
                  t("guarantee3"),
                  t("guarantee4"),
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-tech-slate">
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
            className="mb-10 sm:mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-clean-white border border-border-default/90 p-6 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-flash-orange/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 text-xs font-mono font-bold text-border-strong group-hover:text-flash-orange/60 transition-colors select-none">
                    0{i + 1}
                  </div>
                  <div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform ${pillar.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-tech-slate mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary font-body leading-relaxed">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <SectionHeader
                title="Our Pune Repair Standards & Diagnostics Lab"
                subtitle="Static-controlled diagnostic lab in Sadashiv Peth supporting our mobile on-site fleet."
                align="left"
                className="mb-6"
              />
              <div className="space-y-3.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                <p>
                  QuickFix combines the speed of doorstep technicians with the rigorous testing standards of an ESD-compliant hardware laboratory. Every replacement screen, battery, and camera module is pre-screened on test boards before dispatch.
                </p>
                <p>
                  Technicians carry thermal debonding separators, magnetic screw trays, calibrated digital multimeters, and high-purity isopropyl alcohol ensuring zero static damage to delicate logic boards.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-clean-white border border-border-default px-3.5 py-2 text-xs font-bold text-tech-slate shadow-2xs">
                  <Cpu className="h-4 w-4 text-flash-orange" />
                  <span>ESD-Protected Mobile Kits</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-clean-white border border-border-default px-3.5 py-2 text-xs font-bold text-tech-slate shadow-2xs">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <span>OEM-Batch Serial Verification</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <AspectBox
                aspectRatio="4/3"
                variant="solid"
                badge="Quality Lab"
                fallbackType="service"
                title="ESD-Safe Testing Station"
                label="Calibrated logic board analysis, thermal profiling & OEM part pre-screening"
                className="shadow-md"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Founder Spotlight */}
      <Section variant="white" padding="default">
        <Container>
          <div className="mx-auto max-w-4xl">
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
                  <p className="text-xs sm:text-sm text-text-muted font-medium">
                    {t("founderRole")}
                  </p>

                  <p className="mt-4 text-xs sm:text-sm text-text-secondary font-body leading-relaxed">
                    {t("founderBio")}
                  </p>

                  {/* Quote Box */}
                  <div className="mt-6 rounded-2xl bg-tech-slate-dark/80 border border-border-dark/80 p-4 sm:p-5 flex items-start gap-3 text-left">
                    <Quote className="h-5 w-5 text-flash-orange shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-semibold italic text-clean-white leading-relaxed">
                      &ldquo;{t("founderQuote")}&rdquo;
                    </p>
                  </div>
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
          <CTABlock
            title={t("ctaTitle")}
            subtitle={t("ctaSubtitle")}
          />
        </Container>
      </Section>
    </div>
  );
}
