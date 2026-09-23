import { siteConfig } from "@/config/seo";
import contactConfig from "@/config/contact";
import { LOCALITIES_CATALOG } from "@/config/catalogue-data";
import { getDbBrands, getDbServices } from "@/lib/db/catalogue";

export async function GET() {
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  let brands: { name: string; slug: string }[] = [];
  let services: {
    name: string;
    slug: string;
    description?: string;
    startingPrice?: number;
    estimatedTimeMinutes?: number;
    warrantyDays?: number;
  }[] = [];

  try {
    const [dbBrands, dbServices] = await Promise.all([
      getDbBrands(),
      getDbServices(),
    ]);
    brands = dbBrands;
    services = dbServices;
  } catch {
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
      {
        name: "Screen Replacement",
        slug: "screen-replacement",
        description: "OEM display and touchscreen digitizer replacement with vivid color calibration.",
        startingPrice: 899,
        estimatedTimeMinutes: 30,
        warrantyDays: 90,
      },
      {
        name: "Battery Replacement",
        slug: "battery-replacement",
        description: "Certified high-capacity OEM battery replacement with full health recognition.",
        startingPrice: 699,
        estimatedTimeMinutes: 25,
        warrantyDays: 90,
      },
      {
        name: "Charging Port Repair",
        slug: "charging-port-repair",
        description: "Precision microsoldering and OEM Type-C/Lightning connector dock replacement.",
        startingPrice: 499,
        estimatedTimeMinutes: 30,
        warrantyDays: 90,
      },
      {
        name: "Camera Lens Repair",
        slug: "camera-lens-repair",
        description: "Camera module calibration, optical sensor fix, and sapphire lens glass replacement.",
        startingPrice: 599,
        estimatedTimeMinutes: 35,
        warrantyDays: 90,
      },
      {
        name: "Motherboard Repair",
        slug: "motherboard-repair",
        description: "Chip-level BGA reballing, power IC diagnosis, and liquid damage ultrasonic revival.",
        startingPrice: 999,
        estimatedTimeMinutes: 60,
        warrantyDays: 90,
      },
      {
        name: "Back Glass Repair",
        slug: "back-glass-repair",
        description: "Laser-assisted back glass removal and factory-grade seamless adhesive replacement.",
        startingPrice: 799,
        estimatedTimeMinutes: 45,
        warrantyDays: 90,
      },
    ];
  }

  const content = `# ${siteConfig.name} (${siteConfig.domain}) - Full Knowledge Base

> Comprehensive technical and operational documentation for AI agents, retrieval-augmented generation (RAG), and search indexing.

## Business Overview
- **Brand Name**: ${contactConfig.brand}
- **Legal Entity**: ${contactConfig.legalName}
- **Website Domain**: ${siteConfig.domain}
- **Primary Website URL**: ${siteUrl}
- **Helpline Phone**: ${contactConfig.phone.display} (${contactConfig.phone.value})
- **WhatsApp Assistance**: +${contactConfig.whatsapp.number}
- **Support Email**: ${contactConfig.supportEmail}
- **Operating Hours**: Monday to Sunday, 9:00 AM - 9:00 PM IST
- **Central Lab Address**: ${contactConfig.address.full}
- **Emergency WhatsApp Support**: 24/7 online booking assistance

## How Quick Fix Works
1. **Online Booking or Call**: Customer books a doorstep pickup via ${siteUrl}/en/book-repair or WhatsApp (+91 83086 86454).
2. **Doorstep Pickup**: A verified Quick Fix dispatch technician reaches the customer's home or office anywhere in Pune within 30 to 45 minutes.
3. **Digital Job Sheet & Safe Transit**: Device is inspected, sealed in an anti-static tamper-evident pouch, and issued a digital tracking reference code.
4. **Lab-Grade Repair**: Precision diagnosis and repair in our dust-controlled Sadashiv Peth central lab using calibrated OEM parts.
5. **Quality Control & Safe Return**: 20-point diagnostic check (touch, camera, battery thermals, charging, sensors). Device is returned safely to the customer's doorstep same day.
6. **Payment & Warranty**: Customer inspects the device, pays digitally (UPI, card, cash), and receives a digital 90-day warranty card.

## Repair Services Catalog & Pricing

${services
  .map(
    (s) => `### ${s.name}
- **URL**: ${siteUrl}/en/services/${s.slug}
- **Starting Price**: ₹${s.startingPrice ?? 499}
- **Turnaround Time**: ~${s.estimatedTimeMinutes ?? 30} minutes
- **Warranty Coverage**: ${s.warrantyDays ?? 90} days
- **Description**: ${s.description ?? "Certified repair with genuine OEM components."}
`
  )
  .join("\n")}

## Supported Smartphone Brands & Coverage
We service all major smartphone brands in Pune with certified components:
${brands.map((b) => `- **${b.name}**: ${siteUrl}/en/brands/${b.slug}`).join("\n")}

## Pune Service Localities & Dispatch Times
${LOCALITIES_CATALOG.map(
  (loc) => `### ${loc.name}
- **URL**: ${siteUrl}/en/locations/${loc.slug}
- **Zone**: ${loc.zone} Pune
- **Doorstep Pickup Time**: Within ${loc.dispatchTime}
- **Services Covered**: Screen replacement, battery swap, charging port, camera, motherboard diagnosis.
`
).join("\n")}

## Customer Guarantees & Policies
- **No Fix, No Fee**: If our lab cannot resolve the reported fault, zero repair fee is charged.
- **Strict Data Privacy**: Devices remain locked; customers are never asked for lock-screen PINs or passwords. No customer data is viewed, copied, or altered.
- **Genuine OEM Parts**: We only use grade-A OEM certified replacement parts backed by 90-day replacement warranty.
- **Transparent Pricing**: All estimates are upfront with zero hidden dispatch or diagnostic fees.

## Tracking & Customer Support
- **Live Status Tracking**: ${siteUrl}/en/track
- **Customer Reviews**: ${siteUrl}/en/reviews (Average Rating: 4.9/5 based on 1,450+ verified Pune repairs)
- **Contact Us**: ${siteUrl}/en/contact
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
