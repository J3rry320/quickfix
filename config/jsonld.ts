import contactConfig from "@/config/contact";
import { siteConfig, seoDictionaries } from "@/config/seo";

export function getOrganizationAndLocalBusinessSchema(locale: string = "en") {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": ["RepairBusiness", "LocalBusiness", "MobilePhoneStore"],
    "@id": `${siteUrl}/#business`,
    name: contactConfig.brand,
    legalName: contactConfig.legalName,
    alternateName: "QuickFix Pune",
    description: seoDictionaries.landing[safeLocale].description,
    url: `${siteUrl}/${safeLocale}`,
    logo: `${siteUrl}${siteConfig.defaultOgImage}`,
    image: `${siteUrl}${siteConfig.defaultOgImage}`,
    telephone: contactConfig.phone.display,
    email: contactConfig.email,
    priceRange: "₹₹",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card", "UPI", "Google Pay", "PhonePe", "Paytm"],
    currenciesAccepted: "INR",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1450",
      bestRating: "5",
      worstRating: "1",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: contactConfig.address.shop,
      addressLocality: contactConfig.address.locality,
      addressRegion: contactConfig.address.state,
      postalCode: contactConfig.address.pincode,
      addressCountry: contactConfig.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.5133,
      longitude: 73.8504,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    areaServed: contactConfig.serviceAreas.all.slice(0, 15).map((loc) => ({
      "@type": "AdministrativeArea",
      name: `${loc}, Pune`,
    })),
    sameAs: [
      contactConfig.social.instagram.url,
      contactConfig.social.facebook.url,
      contactConfig.social.twitter.url,
      contactConfig.social.youtube.url,
      contactConfig.social.linkedin.url,
      contactConfig.social.google.url,
    ],
  };
}

export function getWebsiteSchema(locale: string = "en") {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteConfig.name,
    alternateName: ["QuickFix Pune", "QuickFixMobile.in", "Quick Fix Pune"],
    url: `${siteUrl}/${safeLocale}`,
    inLanguage: ["en", "hi", "mr"],
    publisher: {
      "@id": `${siteUrl}/#business`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/${safeLocale}/brands?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getServiceSchema(locale: string = "en") {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Doorstep Smartphone Repair",
    name: seoDictionaries.repair[safeLocale].title,
    description: seoDictionaries.repair[safeLocale].description,
    provider: {
      "@type": "LocalBusiness",
      name: contactConfig.brand,
      telephone: contactConfig.phone.display,
      address: contactConfig.address.full,
    },
    areaServed: {
      "@type": "City",
      name: "Pune",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Doorstep Mobile Repairs",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Smartphone Screen Replacement",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "OEM Battery Replacement",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Charging Port Repair",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Camera and Lens Replacement",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Motherboard Diagnostic & Repair",
          },
        },
      ],
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getAboutPageSchema(locale: string = "en") {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: seoDictionaries.about[safeLocale].title,
    description: seoDictionaries.about[safeLocale].description,
    url: `${siteUrl}/${safeLocale}/about`,
    mainEntity: {
      "@type": "LocalBusiness",
      name: contactConfig.brand,
      founder: {
        "@type": "Person",
        name: contactConfig.ownerName,
        jobTitle: "Founder & Lead Technician",
      },
      foundingLocation: {
        "@type": "Place",
        name: "Sadashiv Peth, Pune",
      },
    },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getServiceDetailPageSchema({
  serviceName,
  description,
  startingPrice,
  warrantyDays = 90,
  estimatedTimeMinutes = 30,
  slug,
  locale = "en",
  image,
}: {
  serviceName: string;
  description: string;
  startingPrice: number;
  warrantyDays?: number;
  estimatedTimeMinutes?: number;
  slug: string;
  locale?: string;
  image?: string;
}) {
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const fullImageUrl = image && image.trim()
    ? image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`
    : `${siteUrl}${siteConfig.defaultOgImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/${locale}/services/${slug}#service`,
    name: serviceName,
    description,
    image: fullImageUrl,
    provider: {
      "@type": "LocalBusiness",
      name: contactConfig.brand,
      telephone: contactConfig.phone.display,
      address: contactConfig.address.full,
      url: `${siteUrl}/${locale}`,
    },
    areaServed: {
      "@type": "City",
      name: "Pune",
    },
    offers: {
      "@type": "Offer",
      price: startingPrice,
      priceCurrency: "INR",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/${locale}/services/${slug}`,
      warranty: `${warrantyDays} days warranty`,
      seller: {
        "@type": "LocalBusiness",
        name: contactConfig.brand,
        telephone: contactConfig.phone.display,
        url: `${siteUrl}/${locale}`,
      },
    },
    serviceOutput: `${serviceName} completed in approx ${estimatedTimeMinutes} mins with genuine OEM parts`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "820",
    },
  };
}

export function getModelDetailPageSchema({
  brandName,
  modelName,
  brandSlug,
  modelSlug,
  startingPrice = 699,
  locale = "en",
  image,
}: {
  brandName: string;
  modelName: string;
  brandSlug: string;
  modelSlug: string;
  startingPrice?: number;
  locale?: string;
  image?: string;
}) {
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const fullImageUrl = image && image.trim()
    ? image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`
    : `${siteUrl}${siteConfig.defaultOgImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${modelName} Repair Service`,
    description: `Professional doorstep repair for ${modelName} in Pune. Screen, battery, camera, and charging port repairs with 90-day warranty.`,
    image: fullImageUrl,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: startingPrice,
      priceCurrency: "INR",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/${locale}/brands/${brandSlug}/${modelSlug}`,
      seller: {
        "@type": "LocalBusiness",
        name: contactConfig.brand,
        telephone: contactConfig.phone.display,
        url: `${siteUrl}/${locale}`,
      },
    },
  };
}

export function getBlogPostSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  authorName = "QuickFix Tech Team",
  locale = "en",
  image,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: Date | string;
  updatedAt?: Date | string;
  authorName?: string;
  locale?: string;
  image?: string;
}) {
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const fullImageUrl = image && image.trim()
    ? image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`
    : `${siteUrl}${siteConfig.defaultOgImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: fullImageUrl,
    url: `${siteUrl}/${locale}/blogs/${slug}`,
    datePublished: publishedAt ? new Date(publishedAt).toISOString() : undefined,
    dateModified: updatedAt ? new Date(updatedAt).toISOString() : undefined,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: contactConfig.brand,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}${siteConfig.defaultOgImage}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${locale}/blogs/${slug}`,
    },
  };
}

export function getTrackPageSchema(locale: string = "en") {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/${safeLocale}/track#webpage`,
    name: seoDictionaries.track[safeLocale].title,
    description: seoDictionaries.track[safeLocale].description,
    url: `${siteUrl}/${safeLocale}/track`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteConfig.name,
      url: siteUrl,
    },
    provider: {
      "@type": "LocalBusiness",
      name: contactConfig.brand,
      telephone: contactConfig.phone.display,
    },
  };
}

export function getReviewsPageSchema(
  locale: string = "en",
  aggregate?: { avgRating: number; totalReviews: number }
) {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const ratingValue = aggregate?.avgRating ? String(aggregate.avgRating) : "4.9";
  const reviewCount = aggregate?.totalReviews ? String(aggregate.totalReviews) : "1450";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: contactConfig.brand,
    url: `${siteUrl}/${safeLocale}/reviews`,
    telephone: contactConfig.phone.display,
    priceRange: "₹₹",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function getLocalityServiceSchema({
  localityName,
  zoneName,
  dispatchTime = "30 Mins",
  slug,
  locale = "en",
}: {
  localityName: string;
  zoneName?: string;
  dispatchTime?: string;
  slug: string;
  locale?: string;
}) {
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const zoneInfo = zoneName ? ` (${zoneName} Pune)` : "";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/${safeLocale}/locations/${slug}#service`,
    name: `Doorstep Mobile Repair in ${localityName}, Pune`,
    description: `Certified doorstep smartphone pickup and lab repair in ${localityName}, Pune${zoneInfo}. ${dispatchTime} dispatch, genuine OEM parts, transparent pricing, and 90-day warranty.`,
    provider: {
      "@type": "LocalBusiness",
      name: contactConfig.brand,
      telephone: contactConfig.phone.display,
      address: contactConfig.address.full,
      url: `${siteUrl}/${safeLocale}`,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${localityName}, Pune`,
    },
    serviceType: "Doorstep Smartphone Repair",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "299",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/${safeLocale}/locations/${slug}`,
      description: `Doorstep mobile repair pickup in ${localityName}, Pune within ${dispatchTime}`,
    },
  };
}

export function getBrandServiceSchema({
  brandName,
  slug,
  logoUrl,
  locale = "en",
}: {
  brandName: string;
  slug: string;
  logoUrl?: string;
  locale?: string;
}) {
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const fullLogoUrl = logoUrl && logoUrl.trim()
    ? logoUrl.startsWith("http://") || logoUrl.startsWith("https://")
      ? logoUrl
      : `${siteUrl}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`
    : `${siteUrl}${siteConfig.defaultOgImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/${safeLocale}/brands/${slug}#service`,
    name: `${brandName} Smartphone Repair in Pune`,
    description: `Expert doorstep pickup and certified lab repairs for ${brandName} smartphones in Pune. Screen, battery, charging port, and motherboard fixes with 90-day warranty.`,
    image: fullLogoUrl,
    provider: {
      "@type": "LocalBusiness",
      name: contactConfig.brand,
      telephone: contactConfig.phone.display,
      address: contactConfig.address.full,
      url: `${siteUrl}/${safeLocale}`,
    },
    areaServed: {
      "@type": "City",
      name: "Pune",
    },
    serviceType: `${brandName} Phone Repair`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "699",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/${safeLocale}/brands/${slug}`,
    },
  };
}

export function getContactPageSchema(locale: string = "en") {
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/${safeLocale}/contact#webpage`,
    name: `Contact ${contactConfig.brand} | Doorstep Phone Repair Pune`,
    description: `Contact ${contactConfig.brand} for doorstep smartphone repair pickup across Pune. Call ${contactConfig.phone.display} or visit our central lab in Sadashiv Peth.`,
    url: `${siteUrl}/${safeLocale}/contact`,
    mainEntity: {
      "@id": `${siteUrl}/#business`,
    },
  };
}

export function getWebPageSchema({
  title,
  description,
  path,
  locale = "en",
}: {
  title: string;
  description: string;
  path: string;
  locale?: string;
}) {
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/${safeLocale}${cleanPath}#webpage`,
    name: title,
    description,
    url: `${siteUrl}/${safeLocale}${cleanPath}`,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@id": `${siteUrl}/#business`,
    },
  };
}

export function getItemListSchema({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string; description?: string; image?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      description: item.description,
      image: item.image,
    })),
  };
}

