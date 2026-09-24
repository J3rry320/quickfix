import contactConfig from "@/config/contact";
import { siteConfig, seoDictionaries } from "@/config/seo";

export function getPostalAddressSchema() {
  return {
    "@type": "PostalAddress",
    streetAddress: contactConfig.address.shop,
    addressLocality: contactConfig.address.locality,
    addressRegion: contactConfig.address.state,
    postalCode: contactConfig.address.pincode,
    addressCountry: contactConfig.address.countryCode,
  };
}

export function getOrganizationAndLocalBusinessSchema(locale: string = "en") {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "RepairBusiness",
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
    address: getPostalAddressSchema(),
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
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const fullImageUrl = image && image.trim()
    ? image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`
    : `${siteUrl}${siteConfig.defaultOgImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/${safeLocale}/services/${slug}#service`,
    name: serviceName,
    description,
    image: fullImageUrl,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      name: contactConfig.brand,
      image: `${siteUrl}${siteConfig.defaultOgImage}`,
      telephone: contactConfig.phone.display,
      address: getPostalAddressSchema(),
      url: `${siteUrl}/${safeLocale}`,
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
      url: `${siteUrl}/${safeLocale}/services/${slug}`,
      warranty: `${warrantyDays} days warranty`,
      seller: {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: contactConfig.brand,
        image: `${siteUrl}${siteConfig.defaultOgImage}`,
        telephone: contactConfig.phone.display,
        url: `${siteUrl}/${safeLocale}`,
        address: getPostalAddressSchema(),
      },
    },
    serviceOutput: `${serviceName} completed in approx ${estimatedTimeMinutes} mins with genuine OEM parts`,
  };
}

export function getModelDetailPageSchema({
  brandName,
  modelName,
  brandSlug,
  modelSlug,
  startingPrice = 699,
  highPrice = 4999,
  offerCount = 6,
  locale = "en",
  image,
}: {
  brandName: string;
  modelName: string;
  brandSlug: string;
  modelSlug: string;
  startingPrice?: number;
  highPrice?: number;
  offerCount?: number;
  locale?: string;
  image?: string;
}) {
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "120",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: startingPrice,
      highPrice: highPrice >= startingPrice ? highPrice : startingPrice,
      offerCount,
      priceCurrency: "INR",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${siteUrl}/${safeLocale}/brands/${brandSlug}/${modelSlug}`,
      seller: {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: contactConfig.brand,
        image: `${siteUrl}${siteConfig.defaultOgImage}`,
        telephone: contactConfig.phone.display,
        url: `${siteUrl}/${safeLocale}`,
        address: getPostalAddressSchema(),
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
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const fullImageUrl = image && image.trim()
    ? image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`
    : `${siteUrl}${siteConfig.defaultOgImage}`;

  const publishedIso = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();
  const modifiedIso = updatedAt ? new Date(updatedAt).toISOString() : publishedIso;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: fullImageUrl,
    url: `${siteUrl}/${safeLocale}/blogs/${slug}`,
    inLanguage: safeLocale,
    datePublished: publishedIso,
    dateModified: modifiedIso,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${siteUrl}/${safeLocale}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: contactConfig.brand,
      url: `${siteUrl}/${safeLocale}`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}${siteConfig.defaultOgImage}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${safeLocale}/blogs/${slug}`,
    },
  };
}

export function getBlogHubSchema({
  locale = "en",
  totalPosts,
  posts = [],
}: {
  locale?: string;
  totalPosts?: number;
  posts?: Array<{
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
  }>;
}) {
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const hubUrl = `${siteUrl}/${safeLocale}/blogs`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${hubUrl}#webpage`,
    url: hubUrl,
    name: "Smartphone Repair Guides, Tips & Tutorials | Quick Fix Pune",
    description:
      "Expert smartphone repair tutorials, lithium battery health guides, OLED screen replacement comparisons, and water damage first aid from Pune's leading doorstep technicians.",
    inLanguage: safeLocale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteConfig.name,
      url: `${siteUrl}/${safeLocale}`,
    },
    about: {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Smartphone Repair Knowledge Base",
      numberOfItems: totalPosts ?? posts.length,
      itemListElement: posts.map((post, index) => {
        const fullImageUrl = post.coverImage && post.coverImage.trim()
          ? post.coverImage.startsWith("http://") || post.coverImage.startsWith("https://")
            ? post.coverImage
            : `${siteUrl}${post.coverImage.startsWith("/") ? "" : "/"}${post.coverImage}`
          : `${siteUrl}${siteConfig.defaultOgImage}`;
        return {
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/${safeLocale}/blogs/${post.slug}`,
          name: post.title,
          description: post.excerpt,
          image: fullImageUrl,
        };
      }),
    },
  };
}

export function getBlogSectionSchema({
  locale = "en",
  posts = [],
}: {
  locale?: string;
  posts: Array<{
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
  }>;
}) {
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/${safeLocale}#blog-highlights`,
    name: "Featured Smartphone Repair Guides & Tech Tips",
    description:
      "Troubleshooting advice, screen care, and maintenance tips by Quick Fix Pune.",
    url: `${siteUrl}/${safeLocale}#blog-highlights`,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => {
      const fullImageUrl = post.coverImage && post.coverImage.trim()
        ? post.coverImage.startsWith("http://") || post.coverImage.startsWith("https://")
          ? post.coverImage
          : `${siteUrl}${post.coverImage.startsWith("/") ? "" : "/"}${post.coverImage}`
        : `${siteUrl}${siteConfig.defaultOgImage}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/${safeLocale}/blogs/${post.slug}`,
        name: post.title,
        description: post.excerpt,
        image: fullImageUrl,
      };
    }),
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

export interface ReviewSchemaItem {
  name: string;
  rating: number;
  comment: string;
  createdAt?: string | Date;
  deviceModel?: string;
  serviceType?: string;
  area?: string;
}

export function getReviewsPageSchema(
  locale: string = "en",
  aggregate?: {
    avgRating: number;
    totalReviews: number;
    reviews?: ReviewSchemaItem[];
  }
) {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const fullImageUrl = `${siteUrl}${siteConfig.defaultOgImage}`;

  const ratingValue = aggregate?.avgRating ? String(aggregate.avgRating) : "4.9";
  const reviewCount = aggregate?.totalReviews ? String(aggregate.totalReviews) : "1450";
  const reviewsList = aggregate?.reviews || [];

  return {
    "@context": "https://schema.org",
    "@type": "RepairBusiness",
    "@id": `${siteUrl}/#business`,
    name: contactConfig.brand,
    legalName: contactConfig.legalName,
    url: `${siteUrl}/${safeLocale}/reviews`,
    image: fullImageUrl,
    logo: fullImageUrl,
    telephone: contactConfig.phone.display,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    address: getPostalAddressSchema(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.5133,
      longitude: 73.8504,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    ...(reviewsList.length > 0 && {
      review: reviewsList.map((r) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.name || "Customer",
        },
        datePublished: r.createdAt
          ? new Date(r.createdAt).toISOString()
          : new Date().toISOString(),
        reviewBody: r.comment,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: "5",
          worstRating: "1",
        },
      })),
    }),
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
      "@id": `${siteUrl}/#business`,
      name: contactConfig.brand,
      image: `${siteUrl}${siteConfig.defaultOgImage}`,
      telephone: contactConfig.phone.display,
      address: getPostalAddressSchema(),
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
      highPrice: "4999",
      offerCount: "10",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/${safeLocale}/locations/${slug}`,
      description: `Doorstep mobile repair pickup in ${localityName}, Pune within ${dispatchTime}`,
      seller: {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: contactConfig.brand,
        image: `${siteUrl}${siteConfig.defaultOgImage}`,
        telephone: contactConfig.phone.display,
        url: `${siteUrl}/${safeLocale}`,
        address: getPostalAddressSchema(),
      },
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
      "@id": `${siteUrl}/#business`,
      name: contactConfig.brand,
      image: `${siteUrl}${siteConfig.defaultOgImage}`,
      telephone: contactConfig.phone.display,
      address: getPostalAddressSchema(),
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
      highPrice: "6999",
      offerCount: "10",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/${safeLocale}/brands/${slug}`,
      seller: {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: contactConfig.brand,
        image: `${siteUrl}${siteConfig.defaultOgImage}`,
        telephone: contactConfig.phone.display,
        url: `${siteUrl}/${safeLocale}`,
        address: getPostalAddressSchema(),
      },
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

