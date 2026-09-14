import type { Metadata } from "next";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getBreadcrumbSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import { Container, Section, Card, CTABlock, PageHero } from "@/components/ui";
import contactConfig from "@/config/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({
    page: "privacy",
    locale,
    path: "/privacy",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Privacy Policy", url: `${siteUrl}/${locale}/privacy` },
  ]);

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd schema={breadcrumbSchema} id="privacy-structured-data" />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
        title="Privacy Policy"
        subtitle="Last updated: September 2026 • Effective across all QuickFix Pune operations"
        align="center"
      />

      <Section variant="white" padding="default">
        <Container size="narrow">
          {/* Key Privacy Highlights Card */}
          <div className="mb-10 rounded-2xl bg-emerald-50/70 border border-emerald-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-clean-white">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-emerald-900">
                Our Zero-Privacy-Invasion Commitment
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Never ask for your device passcode</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero phone data resets or wiping required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Repaired on-site in your presence</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>No photos, chats, or apps accessed</span>
              </div>
            </div>
          </div>

          {/* Policy Content Sections */}
          <div className="space-y-8 text-xs sm:text-sm md:text-base text-zinc-700 font-body leading-relaxed">
            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                1. Information We Collect
              </h3>
              <p>
                When you schedule a doorstep repair through QuickFix.in, we collect only the necessary details required to dispatch a certified technician to your home or workplace in Pune:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-zinc-600 pl-2">
                <li>Your full name and 10-digit Indian contact number.</li>
                <li>Your Pune doorstep address, locality, and optional landmark.</li>
                <li>Your smartphone brand, model, and described hardware/software issue.</li>
                <li>Optional email address for digital warranty cards and tax invoices.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                2. On-Device Customer Data Privacy
              </h3>
              <p>
                Unlike traditional brand service centers that mandate a complete device factory reset, QuickFix operates on a strict <strong>Zero Data Access Protocol</strong>. Because our service requires zero access to your operating system or storage:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-zinc-600 pl-2">
                <li>You never share your device PIN, passcode, pattern, or biometric credentials.</li>
                <li>Your device is transported in a tamper-evident shock-proof pouch and serviced in our ESD-safe central Pune lab.</li>
                <li>Our technicians test display touches, cameras, and sensors only after returning the device to your doorstep, while you unlock the phone yourself.</li>
                <li>We do not connect USB data dump tools, backup suites, or external hardware that inspects internal storage.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                3. How We Use Booking Details
              </h3>
              <p>
                Your booking records are used exclusively to fulfill doorstep dispatch logistics, provide automated SMS or WhatsApp status updates, and validate your 90-day warranty claims. We never sell, rent, or trade your contact details with third-party advertisers.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                4. Payment Information Security
              </h3>
              <p>
                QuickFix does not store or process debit/credit card numbers on our servers. All digital payments are conducted on-site post-repair via verified UPI QR codes (Google Pay, PhonePe, Paytm), official merchant POS card terminals, or cash.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                5. Contact Us Regarding Your Data
              </h3>
              <p>
                For questions regarding data retention, warranty records, or to request deletion of your contact profile, please contact our Pune dispatch hub:
              </p>
              <div className="mt-3 rounded-xl bg-mist-gray p-4 text-xs sm:text-sm text-zinc-700">
                <p className="font-bold text-tech-slate">{contactConfig.legalName}</p>
                <p>{contactConfig.address.full}</p>
                <p>Email: {contactConfig.email} • Hotline: {contactConfig.phone.display}</p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <CTABlock />
          </div>
        </Container>
      </Section>
    </div>
  );
}
