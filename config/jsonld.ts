import contactConfig from "@/config/contact";
import { siteConfig, seoDictionaries } from "@/config/seo";

export function getOrganizationAndLocalBusinessSchema(locale: string = "en") {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService", "MobilePhoneStore"],
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
    alternateName: "QuickFix Mobile Repair Pune",
    url: `${siteUrl}/${safeLocale}`,
    inLanguage: ["en", "hi", "mr"],
    publisher: {
      "@id": `${siteUrl}/#business`,
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
