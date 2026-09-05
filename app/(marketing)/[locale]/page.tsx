import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import PriceEstimator from "@/components/landing/PriceEstimator";
import ServicesCatalog from "@/components/landing/ServicesCatalog";
import BrandsShowcase from "@/components/landing/BrandsShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyQuickFix from "@/components/landing/WhyQuickFix";
import DoorstepBookingForm from "@/components/landing/DoorstepBookingForm";
import Testimonials from "@/components/landing/Testimonials";
import LocalitiesDirectory from "@/components/landing/LocalitiesDirectory";
import BlogHighlights from "@/components/landing/BlogHighlights";
import FaqSection from "@/components/landing/FaqSection";
import QuickContactForm from "@/components/landing/QuickContactForm";

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section & Initial Trust Bar */}
      <Hero />

      {/* 2. Interactive Instant Price Estimator */}
      <PriceEstimator />

      {/* 3. Popular Repair Services Catalog Grid */}
      <ServicesCatalog />

      {/* 4. Supported Brands & Device Models Strip */}
      <BrandsShowcase />

      {/* 5. How It Works: 4-Step Doorstep Process & Video Demo */}
      <HowItWorks />

      {/* 6. Why QuickFix: Comparison vs Service Center vs Local Shop */}
      <WhyQuickFix />

      {/* 7. Book a Doorstep Repair Wizard Form */}
      <DoorstepBookingForm />

      {/* 8. Pune Customer Testimonials & Social Proof */}
      <Testimonials />

      {/* 9. Pune Localities & Doorstep Dispatch Coverage */}
      <LocalitiesDirectory />

      {/* 10. Latest Smartphone Care Guides & Blog Articles */}
      <BlogHighlights />

      {/* 11. Frequently Asked Questions (FAQPage SEO Schema) */}
      <FaqSection />

      {/* 12. 5-Minute Callback / Quick Contact Form */}
      <QuickContactForm />
    </div>
  );
}
