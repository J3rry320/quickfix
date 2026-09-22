import type { Metadata } from "next";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { getSeoMetadata, siteConfig } from "@/config/seo";
import { getBreadcrumbSchema, getWebPageSchema } from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import { Container, Section, CTABlock, PageHero } from "@/components/ui";
import contactConfig from "@/config/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({
    page: "terms",
    locale,
    path: "/terms",
  });
}

import { cacheLife } from "next/cache";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheLife("max");

  const { locale } = await params;

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: "Terms of Service", url: `${siteUrl}/${locale}/terms` },
  ]);

  const termsSchema = getWebPageSchema({
    title: "Terms of Service | Quick Fix",
    description: "Terms and conditions for doorstep mobile repair services provided by Quick Fix across Pune, including 90-day warranty and service guarantees.",
    path: "/terms",
    locale,
  });

  return (
    <div className="flex flex-col w-full bg-clean-white">
      <JsonLd
        schema={[breadcrumbSchema, termsSchema]}
        id="terms-structured-data"
      />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" },
        ]}
        title="Terms of Service"
        subtitle="Clear, fair, and transparent service guidelines for all doorstep smartphone repairs across Pune"
        align="center"
      />

      <Section variant="white" padding="default">
        <Container size="narrow">
          {/* Warranty Terms Card */}
          <div className="mb-10 rounded-2xl bg-warning-light/80 border border-warning-border p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-amber text-tech-slate">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-warning-text">
                90-Day Hassle-Free Warranty Terms
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-warning-text leading-relaxed mb-4">
              All OEM-grade screens, batteries, charging ports, and camera modules installed by QuickFix are covered under our comprehensive 90-day parts replacement warranty.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-semibold text-warning-text">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span>Covers touch malfunction & screen flickering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span>Covers battery degradation & sudden drops</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span>Free doorstep technician re-visit if part fails</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span>Instant free replacement with valid booking ID</span>
              </div>
            </div>
          </div>

          {/* Terms Articles */}
          <div className="space-y-8 text-xs sm:text-sm md:text-base text-text-secondary font-body leading-relaxed">
            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                1. Doorstep Service Protocol & Turnaround
              </h3>
              <p>
                Our standard doorstep turnaround time is 30 to 45 minutes for standard module swaps (screen, battery, charging port, camera). The customer is responsible for providing a clean table or work area with normal lighting and access to an electrical outlet if micro-heating or testing is required.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                2. No Fix, No Fee Policy
              </h3>
              <p>
                If our technician inspects your device on-site and concludes that the smartphone cannot be repaired due to severe internal motherboard PCB fracture or irreparable water damage, there is <strong>zero repair charge</strong>. Zero visit fee applies within all primary Pune operational zones.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                3. Post-Repair Inspection & Payment
              </h3>
              <p>
                The customer is requested to inspect display clarity, touchscreen sensitivity across all corners, front/rear camera focusing, and speaker output in the presence of the technician prior to making payment. Payment can be fulfilled via UPI, Credit/Debit Card, or Cash upon your full satisfaction.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                4. Warranty Inclusions & Exclusions
              </h3>
              <p>
                Our 90-day parts warranty applies strictly to manufacturing defects and performance failures of the installed component. The warranty is automatically voided under the following post-repair conditions:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-text-muted pl-2">
                <li>Subsequent physical drops, hairline cracks, or impact marks on display or back glass.</li>
                <li>Water or moisture ingress occurring after the repair completion.</li>
                <li>Tampering or opening of the device by an unauthorized third-party technician.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                5. Centralized Lab Escalation (For Complex Issues)
              </h3>
              <p>
                Fewer than 5% of devices (such as heavy short-circuit motherboard micro-soldering or multi-rail power IC failures) cannot be repaired safely at a doorstep table. In such cases, our technician will provide an official physical and digital pickup acknowledgement voucher and transfer the phone to our Sadashiv Peth lab, returning it within 24 to 48 hours.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-tech-slate mb-2">
                6. Customer Support & Warranty Claims
              </h3>
              <p>
                To raise a warranty re-visit or clarify any billing question, simply reference your unique Booking ID (e.g. QF-2609-XXXXX) via WhatsApp or phone:
              </p>
              <div className="mt-3 rounded-xl bg-mist-gray p-4 text-xs sm:text-sm text-text-secondary">
                <p className="font-bold text-tech-slate">{contactConfig.brand}</p>
                <p>Phone: {contactConfig.phone.display} • WhatsApp: {contactConfig.whatsapp.display}</p>
                <p>Hub: {contactConfig.address.full}</p>
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
