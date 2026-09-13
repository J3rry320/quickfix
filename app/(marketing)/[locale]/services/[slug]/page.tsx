import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Clock, ShieldCheck, Wrench, CheckCircle2, ArrowRight, Zap, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig, getServiceSeoMetadata } from "@/config/seo";
import { getBreadcrumbSchema, getServiceDetailPageSchema } from "@/config/jsonld";
import { SERVICES_CATALOG } from "@/config/catalogue-data";
import contactConfig from "@/config/contact";
import JsonLd from "@/components/seo/JsonLd";
import { Container, Section, Badge, AspectBox, CTABlock } from "@/components/ui";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const service of SERVICES_CATALOG) {
      params.push({ locale, slug: service.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found | QuickFix.in",
    };
  }

  return getServiceSeoMetadata({
    serviceName: service.shortTitle,
    startingPrice: service.startingPrice,
    turnaroundMinutes: service.estimatedTimeMinutes,
    locale,
    slug: service.slug,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = SERVICES_CATALOG.find((s) => s.slug === slug);
  if (!service) {
    notFound();
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Services", url: `${siteUrl}/${locale}/#services` },
    { name: service.shortTitle, url: `${siteUrl}/${locale}/services/${service.slug}` },
  ]);

  const serviceSchema = getServiceDetailPageSchema({
    serviceName: service.name,
    description: service.description,
    startingPrice: service.startingPrice,
    warrantyDays: service.warrantyDays,
    estimatedTimeMinutes: service.estimatedTimeMinutes,
    slug: service.slug,
    locale,
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={[breadcrumbSchema, serviceSchema]} id={`service-${service.slug}-structured-data`} />

      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-zinc-200 bg-mist-gray/60 py-3">
        <Container>
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-flash-orange transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#services" className="hover:text-flash-orange transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-tech-slate">{service.shortTitle}</span>
          </nav>
        </Container>
      </div>

      {/* 2. Service Hero Section */}
      <Section variant="white" padding="default">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="amber" size="md">
                  ⚡ {service.estimatedTimeMinutes} Mins Doorstep
                </Badge>
                <Badge variant="success" size="md">
                  🛡️ {service.warrantyDays}-Day Parts Warranty
                </Badge>
                <Badge variant="default" size="md">
                  Pune Wide
                </Badge>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-tech-slate tracking-tight leading-[1.15]">
                {service.name}
              </h1>

              <p className="mt-4 text-xs sm:text-sm md:text-base text-zinc-600 font-body leading-relaxed max-w-2xl">
                {service.description}
              </p>

              {/* Price & Turnaround Metric Bar */}
              <div className="mt-6 flex flex-wrap items-baseline gap-6 p-4 rounded-2xl bg-mist-gray/70 border border-zinc-200">
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                    Starting From
                  </span>
                  <span className="font-heading text-2xl sm:text-3xl font-black text-tech-slate">
                    ₹{service.startingPrice}
                  </span>
                </div>
                <div className="h-8 w-px bg-zinc-300 hidden sm:block" />
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                    Turnaround Time
                  </span>
                  <span className="font-heading text-lg sm:text-xl font-bold text-tech-slate flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-4 w-4 text-flash-orange" />
                    {service.estimatedTimeMinutes} Minutes
                  </span>
                </div>
                <div className="h-8 w-px bg-zinc-300 hidden sm:block" />
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                    Guarantee
                  </span>
                  <span className="font-heading text-lg sm:text-xl font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    No Fix, No Fee
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/book-repair"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
                >
                  <span>Book Doorstep Repair</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={`tel:${contactConfig.phone.value}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-zinc-300 text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
                >
                  <Phone className="h-4 w-4 text-flash-orange" />
                  <span>Call {contactConfig.phone.display}</span>
                </a>
              </div>
            </div>

            {/* Right Media AspectBox */}
            <div className="lg:col-span-5">
              <AspectBox
                aspectRatio="4/3"
                badge={service.shortTitle}
                label="High-resolution repair illustration / technician workspace"
                className="shadow-md"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Common Issues Section */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <Badge variant="accent" size="sm" className="mb-2">
              Diagnostics
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Common Signs You Need {service.shortTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              If your smartphone exhibits any of these symptoms, our technician will carry the exact matching OEM part directly to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {service.commonIssues.map((issue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-clean-white border border-zinc-200 shadow-2xs hover:border-flash-orange/40 transition-all"
              >
                <CheckCircle2 className="h-5 w-5 text-flash-orange shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-tech-slate leading-snug">
                  {issue}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. Step-by-Step Doorstep Process */}
      <Section variant="white" padding="default">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="amber" size="sm" className="mb-2">
              4-Step Repair Protocol
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              How Our Doorstep {service.shortTitle} Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Performed live before your eyes on an antistatic workstation. No factory resets, no passcode required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {service.processSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-elevated-surface border border-zinc-200/90 flex flex-col justify-between"
              >
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-tech-slate text-clean-white font-heading text-sm font-black mb-3">
                    0{idx + 1}
                  </span>
                  <h3 className="font-heading text-base font-bold text-tech-slate mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-body leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Reusable CTA Block */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title={`Schedule Doorstep ${service.shortTitle} in Pune`}
            subtitle={`Technicians equipped with OEM ${service.shortTitle.toLowerCase()} parts dispatched in under 45 minutes across all Pune localities.`}
            badge={`${service.estimatedTimeMinutes}-Min Fast Turnaround`}
          />
        </Container>
      </Section>
    </div>
  );
}
