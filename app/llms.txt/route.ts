import { siteConfig } from "@/config/seo";
import { LOCALITIES_CATALOG } from "@/config/catalogue-data";
import { getDbBrands, getDbServices } from "@/lib/db/catalogue";

export const revalidate = 86400; // 24 hours

export async function GET() {
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  let brands: { name: string; slug: string }[] = [];
  let services: { name: string; slug: string; startingPrice?: number }[] = [];

  try {
    const [dbBrands, dbServices] = await Promise.all([
      getDbBrands(),
      getDbServices(),
    ]);
    brands = dbBrands;
    services = dbServices;
  } catch {
    // Graceful fallback if database connection is unavailable during build
    brands = [
      { name: "Apple", slug: "apple" },
      { name: "Samsung", slug: "samsung" },
      { name: "OnePlus", slug: "oneplus" },
      { name: "Xiaomi", slug: "xiaomi" },
      { name: "Google Pixel", slug: "google-pixel" },
      { name: "Vivo", slug: "vivo" },
      { name: "Oppo", slug: "oppo" },
      { name: "Realme", slug: "realme" },
    ];
    services = [
      { name: "Screen Replacement", slug: "screen-replacement", startingPrice: 899 },
      { name: "Battery Replacement", slug: "battery-replacement", startingPrice: 699 },
      { name: "Charging Port Repair", slug: "charging-port-repair", startingPrice: 499 },
      { name: "Camera Lens Repair", slug: "camera-lens-repair", startingPrice: 599 },
      { name: "Motherboard Repair", slug: "motherboard-repair", startingPrice: 999 },
      { name: "Back Glass Repair", slug: "back-glass-repair", startingPrice: 799 },
    ];
  }

  const content = `# ${siteConfig.name} (${siteConfig.domain})

> Pune's premier certified doorstep smartphone pickup, central lab repair, and same-day delivery service. 90-day warranty, genuine OEM parts, transparent pricing, and zero visit fee. Central lab located at Sadashiv Peth, Pune.

## Core Services & Booking
- [Doorstep Mobile Repair Booking](${siteUrl}/en/book-repair): Online booking wizard for doorstep smartphone pickup across Pune within 30 minutes.
- [Live Repair Tracking](${siteUrl}/en/track): Real-time tracking of device pickup, lab diagnosis, repair progress, and return delivery.
- [Customer Reviews & Ratings](${siteUrl}/en/reviews): Verified customer reviews and ratings (4.9/5 from 1,450+ Pune customers).
- [About Quick Fix](${siteUrl}/en/about): Company background, central repair lab at Sadashiv Peth, certified technician team, and data privacy protocols.
- [Contact & Support](${siteUrl}/en/contact): Helpline (+91 83086 86454), 24/7 WhatsApp booking support, and service center location.

## Repair Services
${services
  .map(
    (s) =>
      `- [${s.name} in Pune](${siteUrl}/en/services/${s.slug}): Certified doorstep pickup and lab repair starting from ₹${s.startingPrice ?? 499} with 90-day warranty.`
  )
  .join("\n")}

## Supported Smartphone Brands
${brands
  .map(
    (b) =>
      `- [${b.name} Phone Repair Pune](${siteUrl}/en/brands/${b.slug}): Expert doorstep pickup, OEM parts, and certified repairs for ${b.name} models.`
  )
  .join("\n")}

## Service Localities (Pune)
${LOCALITIES_CATALOG.map(
  (loc) =>
    `- [Mobile Repair in ${loc.name}](${siteUrl}/en/locations/${loc.slug}): Fast doorstep pickup within ${loc.dispatchTime} in ${loc.name}, Pune (${loc.zone} Zone).`
).join("\n")}

## Diagnostic Guides & Tech Articles
- [Smartphone Repair Guides & Tips](${siteUrl}/en/blogs): Diagnostic tutorials, battery health guides, screen replacement comparisons, and water damage recovery tips.

## Full Context Document
- [Full LLM Knowledge Base](${siteUrl}/llms-full.txt): Comprehensive documentation including pricing matrices, diagnostic procedures, warranty terms, and service areas.

## Optional
- [Privacy Policy](${siteUrl}/en/privacy): Customer data protection, repair confidentiality, and zero-access privacy guarantee.
- [Terms of Service](${siteUrl}/en/terms): Warranty policies, no-fix-no-fee guarantee, and service conditions.
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
