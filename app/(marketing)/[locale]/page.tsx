import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSeoMetadata } from "@/config/seo";
import { getFaqPageSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/landing/TrustBadges";
import ServicesCatalog from "@/components/landing/ServicesCatalog";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyQuickFix from "@/components/landing/WhyQuickFix";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import LocalitiesDirectory from "@/components/landing/LocalitiesDirectory";
import Testimonials from "@/components/landing/Testimonials";
import FaqSection from "@/components/landing/FaqSection";
import BlogHighlights from "@/components/landing/BlogHighlights";
import QuickContactForm from "@/components/landing/QuickContactForm";
import { ModelsScrollSection } from "@/components/models";
import { getPopularDbModels, getDbBrands } from "@/lib/db/catalogue";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({ page: "landing", locale, path: "/" });
}

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [tFaq, tModels, popularModels, brands] = await Promise.all([
    getTranslations({ locale, namespace: "Faq" }),
    getTranslations({ locale, namespace: "PopularModels" }),
    getPopularDbModels(24),
    getDbBrands(),
  ]);

  const faqSchema = getFaqPageSchema([
    { question: tFaq("q1"), answer: tFaq("a1") },
    { question: tFaq("q2"), answer: tFaq("a2") },
    { question: tFaq("q3"), answer: tFaq("a3") },
    { question: tFaq("q4"), answer: tFaq("a4") },
    { question: tFaq("q5"), answer: tFaq("a5") },
  ]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <JsonLd schema={faqSchema} id="landing-faq-structured-data" />

      {/* 1. Hero Section: Minimal & Punchy */}
      <Hero />

      {/* 2. Independent Reusable Trust Badges Strip */}
      <TrustBadges />

      {/* 3. Popular Repair Services Catalog */}
      <ServicesCatalog />

      {/* 4. How Doorstep Repair Works: 4-Step Process */}
      <HowItWorks />

      {/* 6. Why QuickFix: Mobile Responsive Comparison */}
      <WhyQuickFix />

      {/* 7. Supported Smartphone Brands */}
      <BrandsShowcase />

      {/* 7.5 Top Popular Smartphone Models We Repair */}
      {popularModels.length > 0 && (
        <ModelsScrollSection
          models={popularModels}
          brands={brands}
          showBrandFilter={true}
          badge={tModels("badge")}
          title={tModels("title")}
          subtitle={tModels("subtitle")}
          sectionVariant="white"
        />
      )}

      {/* 8. Pune Localities & Doorstep Dispatch Coverage */}
      <LocalitiesDirectory />

      {/* 9. Verified Pune Customer Reviews */}
      <Testimonials />

      {/* 10. Frequently Asked Questions */}
      <FaqSection />

      {/* 11. Smartphone Care Guides & Blog Articles */}
      <BlogHighlights />

      {/* 12. General Enquiry / 5-Minute Callback Form */}
      <QuickContactForm />
    </div>
  );
}
