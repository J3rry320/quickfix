import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, ShieldCheck, Wrench, CheckCircle2, ArrowRight, Zap, Phone, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig, getServiceSeoMetadata } from "@/config/seo";
import { getBreadcrumbSchema, getServiceDetailPageSchema } from "@/config/jsonld";
import { getDbServiceBySlug, getStaticServiceSlugs, getBrandsForService } from "@/lib/db/catalogue";
import contactConfig from "@/config/contact";
import JsonLd from "@/components/seo/JsonLd";
import { Container, Section, AspectBox, CTABlock, PageHero, ProcessStepGrid } from "@/components/ui";

export async function generateStaticParams() {
  const slugs = await getStaticServiceSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
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
  const service = await getDbServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | QuickFix.in",
    };
  }

  return getServiceSeoMetadata({
    serviceName: service.name,
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

  const service = await getDbServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  const supportedBrands = await getBrandsForService(slug);

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Services", url: `${siteUrl}/${locale}/services` },
    { name: service.name, url: `${siteUrl}/${locale}/services/${service.slug}` },
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

  const serviceFaqs = [
    {
      q: `Will my personal data remain 100% safe during ${service.name.toLowerCase()}?`,
      a: "Yes. Our technician collects your device with an official job sheet and sealed transit pouch. You never have to share passcodes, unlock patterns, or wipe data. Repairs are performed in our ESD-safe central Pune lab with zero access to your private files.",
    },
    {
      q: `What warranty do you provide on this repair?`,
      a: `Every ${service.name.toLowerCase()} includes a ${service.warrantyDays}-day hassle-free replacement warranty with a digital invoice sent directly to your email and phone.`,
    },
    {
      q: `Are replacement components OEM grade?`,
      a: "Yes. We source verified, factory-tested OEM-grade components that match original factory specifications for refresh rates, touch sensitivity, thermal stability, and battery capacity.",
    },
    {
      q: `How long does the repair and doorstep delivery take?`,
      a: `Most repairs are completed within ${service.estimatedTimeMinutes} minutes in our lab and delivered back to your doorstep on the very same day across Pune.`,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={[breadcrumbSchema, serviceSchema]} id={`service-${service.slug}-structured-data`} />

      {/* 1. Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
        title={service.name}
        subtitle={service.description}
        highlights={[
          {
            label: "Starting From",
            value: `₹${service.startingPrice}`,
            color: "text-flash-orange",
          },
          {
            icon: Clock,
            label: "Turnaround",
            value: `${service.estimatedTimeMinutes} Mins`,
            color: "text-blue-500",
          },
          {
            icon: ShieldCheck,
            label: "Warranty",
            value: `${service.warrantyDays} Days`,
            color: "text-emerald-500",
          },
          {
            icon: Zap,
            label: "Service Mode",
            value: "Doorstep Anywhere in Pune",
            color: "text-electric-amber",
          },
        ]}
        actions={
          <>
            <Link
              href="/book-repair"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-7 py-3.5 text-sm font-extrabold text-clean-white shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
            >
              <span>Book {service.name}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${contactConfig.phone.value}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-zinc-300 text-tech-slate px-6 py-3.5 text-sm font-extrabold hover:bg-mist-gray active:scale-95 transition-all"
            >
              <Phone className="h-4 w-4 text-flash-orange" />
              <span>Call {contactConfig.phone.display}</span>
            </a>
          </>
        }
        media={
          <AspectBox
            aspectRatio="4/3"
            badge="Doorstep Toolkit"
            label={`Professional on-site toolkit for ${service.name} in Pune`}
            className="shadow-md"
          />
        }
      />

      {/* 2. Common Issues Resolved */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Symptoms Indicating You Need This Repair
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              If your smartphone exhibits any of the symptoms below, our certified technicians can fix it in under {service.estimatedTimeMinutes} minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {service.commonIssues.map((issue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-clean-white border border-zinc-200 shadow-2xs"
              >
                <CheckCircle2 className="h-5 w-5 text-flash-orange shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-tech-slate">{issue}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Standardized 4-Step Doorstep Process */}
      <Section variant="white" padding="default">
        <Container>
          <ProcessStepGrid
            title="How Our Doorstep Repair Operates in Pune"
            subtitle="Transparent, upfront, and fully executed in your physical presence."
          />
        </Container>
      </Section>

      {/* 4. Supported Brands for this Service */}
      <Section variant="muted" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Supported Smartphone Brands for {service.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Select your smartphone brand to view exact model pricing and reserve doorstep service.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {supportedBrands.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="p-4 rounded-xl bg-clean-white border border-border-default hover:border-flash-orange hover:shadow-xs transition-all text-center group flex flex-col items-center justify-center"
              >
                <span className="font-heading text-sm font-bold text-tech-slate group-hover:text-flash-orange transition-colors">
                  {b.name}
                </span>
                <span className="text-2xs text-text-muted mt-1">View Models →</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Service FAQs */}
      <Section variant="white" padding="default">
        <Container>
          <div className="max-w-3xl mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-tech-slate tracking-tight">
              Frequently Asked Questions About {service.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600">
              Everything you need to know about our certified doorstep procedure in Pune.
            </p>
          </div>

          <div className="max-w-4xl space-y-4">
            {serviceFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border-default bg-clean-white p-5 sm:p-6 shadow-2xs"
              >
                <h3 className="font-heading text-base font-bold text-tech-slate flex items-start gap-2.5">
                  <HelpCircle className="h-5 w-5 text-flash-orange shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-muted leading-relaxed pl-7.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Reusable CTA Block */}
      <Section variant="muted" padding="default">
        <Container>
          <CTABlock
            title={`Schedule Your ${service.name} Today`}
            subtitle="Technician dispatched anywhere across Pune in 30 minutes. 90-day warranty included."
          />
        </Container>
      </Section>
    </div>
  );
}
