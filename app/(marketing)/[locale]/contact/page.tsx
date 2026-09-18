import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, Navigation } from "lucide-react";
import { routing } from "@/i18n/routing";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getOrganizationAndLocalBusinessSchema, getBreadcrumbSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import contactConfig from "@/config/contact";
import ContactForm from "@/components/contact/ContactForm";
import GoogleMapEmbed from "@/components/contact/GoogleMapEmbed";
import { PageHero } from "@/components/ui";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({
    page: "contact",
    locale,
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheLife("days");

  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "ContactPage" });
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const localBusinessSchema = getOrganizationAndLocalBusinessSchema(locale);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("title") || "Contact Us", url: `${siteUrl}/${locale}/contact` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white min-h-[calc(100vh-4rem)]">
      <JsonLd schema={[localBusinessSchema, breadcrumbSchema]} id="contact-structured-data" />

      {/* 1. Unified Page Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: t("title") || "Contact Us" },
        ]}
        title={t("title")}
        subtitle={t("subtitle")}
        align="center"
        highlights={[
          {
            icon: Phone,
            label: "Helpline",
            value: contactConfig.phone.display,
            color: "text-flash-orange",
          },
          {
            icon: MessageSquare,
            label: "WhatsApp",
            value: "Instant Support",
            color: "text-success",
          },
          {
            icon: MapPin,
            label: "Lab",
            value: "Sadashiv Peth",
            color: "text-info",
          },
          {
            icon: ShieldCheck,
            label: "Coverage",
            value: "All Pune & PCMC",
            color: "text-electric-amber",
          },
        ]}
      />

      <div className="py-10 sm:py-16 bg-mist-gray/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 3 Quick Action Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {/* Hotline Card */}
          <div className="rounded-2xl border border-border-default bg-clean-white p-6 shadow-sm flex flex-col justify-between hover:border-flash-orange/40 transition-colors">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flash-orange/10 text-flash-orange mb-4">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-tech-slate">
                {t("hotline.title")}
              </h3>
              <p className="mt-1 text-xs text-text-muted font-body">
                {t("hotline.desc")}
              </p>
              <div className="mt-4 font-mono text-base font-extrabold text-tech-slate">
                {contactConfig.phone.display}
              </div>
            </div>
            <a
              href={`tel:${contactConfig.phone.value}`}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-flash-orange px-4 py-2.5 text-xs font-bold text-clean-white hover:bg-flash-orange-hover transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{t("hotline.action")}</span>
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="rounded-2xl border border-border-default bg-clean-white p-6 shadow-sm flex flex-col justify-between hover:border-whatsapp/40 transition-colors">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-whatsapp/10 text-whatsapp mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-tech-slate">
                {t("whatsapp.title")}
              </h3>
              <p className="mt-1 text-xs text-text-muted font-body">
                {t("whatsapp.desc")}
              </p>
              <div className="mt-4 font-mono text-base font-extrabold text-tech-slate">
                {contactConfig.whatsapp.display}
              </div>
            </div>
            <a
              href={contactConfig.whatsapp.getDefaultUrl("Hello QuickFix, I need support regarding a phone repair.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-xs font-bold text-clean-white hover:bg-whatsapp-hover transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{t("whatsapp.action")}</span>
            </a>
          </div>

          {/* Email Card */}
          <div className="rounded-2xl border border-border-default bg-clean-white p-6 shadow-sm flex flex-col justify-between hover:border-border-strong transition-colors">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-hover text-tech-slate mb-4">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-tech-slate">
                {t("email.title")}
              </h3>
              <p className="mt-1 text-xs text-text-muted font-body">
                {t("email.desc")}
              </p>
              <div className="mt-4 text-xs font-bold text-tech-slate break-all">
                {contactConfig.email}
              </div>
            </div>
            <a
              href={`mailto:${contactConfig.email}`}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-clean-white px-4 py-2.5 text-xs font-bold text-tech-slate hover:bg-surface-hover transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{t("email.action")}</span>
            </a>
          </div>
        </div>

        {/* 2-Column Section: Hub Details & Coverage vs Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Central Hub, Hours & Coverage */}
          <div className="lg:col-span-6 space-y-6">
            {/* Sadashiv Peth Central Hub Card */}
            <div className="rounded-3xl border border-border-default bg-clean-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-flash-orange">
                  {t("hub.badge")}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success-light px-2.5 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Open Today
                </span>
              </div>

              <h3 className="font-heading text-xl font-extrabold text-tech-slate mb-4">
                {t("hub.title")}
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-text-secondary font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-flash-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-tech-slate">{t("hub.address")}</p>
                    <p className="text-xs text-text-muted mt-0.5">{t("hub.landmark")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-flash-orange shrink-0" />
                  <span>{t("hub.hours")}</span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  <span className="text-success-text font-bold">{t("hub.sla")}</span>
                </div>
              </div>

              {/* Google Maps Interactive Hub Location Embed */}
              <div className="mt-5">
                <GoogleMapEmbed
                  heightClass="h-56 sm:h-64"
                  title="QuickFix Sadashiv Peth Service Hub Google Map"
                />
              </div>

              <div className="mt-5 pt-4 border-t border-border-default flex flex-col sm:flex-row gap-3">
                <a
                  href={contactConfig.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-tech-slate px-5 py-3 text-xs font-bold text-clean-white hover:bg-tech-slate-dark transition-colors shadow-xs"
                >
                  <Navigation className="h-3.5 w-3.5 text-electric-amber" />
                  <span>{t("hub.directionsAction")}</span>
                </a>
              </div>
            </div>

            {/* Coverage Zones Summary */}
            <div className="rounded-3xl border border-border-default bg-clean-white p-6 sm:p-8 shadow-sm">
              <h4 className="font-heading text-base font-extrabold text-tech-slate mb-2">
                {t("coverage.title")}
              </h4>
              <p className="text-xs text-text-muted mb-4">
                {t("coverage.subtitle")}
              </p>

              <div className="space-y-2.5 text-xs font-medium text-text-secondary">
                <div className="p-3 rounded-xl bg-mist-gray/80 border border-border-default/60">
                  {t("coverage.zones.west")}
                </div>
                <div className="p-3 rounded-xl bg-mist-gray/80 border border-border-default/60">
                  {t("coverage.zones.east")}
                </div>
                <div className="p-3 rounded-xl bg-mist-gray/80 border border-border-default/60">
                  {t("coverage.zones.central")}
                </div>
                <div className="p-3 rounded-xl bg-mist-gray/80 border border-border-default/60">
                  {t("coverage.zones.south")}
                </div>
                <div className="p-3 rounded-xl bg-mist-gray/80 border border-border-default/60">
                  {t("coverage.zones.north")}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
