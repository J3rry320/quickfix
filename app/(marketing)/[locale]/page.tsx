import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getSeoMetadata } from "@/config/seo";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/landing/TrustBadges";
import ServicesCatalog from "@/components/landing/ServicesCatalog";
import PriceEstimator from "@/components/landing/PriceEstimator";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyQuickFix from "@/components/landing/WhyQuickFix";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import LocalitiesDirectory from "@/components/landing/LocalitiesDirectory";
import Testimonials from "@/components/landing/Testimonials";
import FaqSection from "@/components/landing/FaqSection";
import BlogHighlights from "@/components/landing/BlogHighlights";
import QuickContactForm from "@/components/landing/QuickContactForm";

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

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Hero Section: Minimal & Punchy */}
      <Hero />

      {/* 2. Independent Reusable Trust Badges Strip */}
      <TrustBadges />

      {/* 3. Popular Repair Services Catalog */}
      <ServicesCatalog />

      {/* 4. Interactive Instant Price Estimator */}
      <PriceEstimator />

      {/* 5. How Doorstep Repair Works: 4-Step Process */}
      <HowItWorks />

      {/* 6. Why QuickFix: Mobile Responsive Comparison */}
      <WhyQuickFix />

      {/* 7. Supported Smartphone Brands & Models */}
      <BrandsShowcase />

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
