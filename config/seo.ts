import type { Metadata } from "next";

export const siteConfig = {
  name: "QuickFix.in",
  legalName: "QuickFix Mobile Solutions",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://quickfix.in",
  defaultOgImage: "/logo.png",
  supportedLocales: ["en", "hi", "mr"] as const,
  defaultLocale: "en",
};

export type SeoPageKey = "landing" | "repair" | "about" | "privacy" | "terms" | "estimate" | "contact";

interface LocalizedSeoEntry {
  title: string;
  description: string;
  keywords: string[];
}

export const seoDictionaries: Record<
  SeoPageKey,
  Record<"en" | "hi" | "mr", LocalizedSeoEntry>
> = {
  landing: {
    en: {
      title: "QuickFix.in | 30-Minute Doorstep Mobile Repair in Pune",
      description:
        "Fast, reliable doorstep mobile repairs across Pune in 30 minutes with genuine OEM parts, transparent pricing, and a 90-day warranty. Book phone screen, battery, and camera repairs today.",
      keywords: [
        "mobile repair pune",
        "doorstep mobile repair",
        "phone screen replacement pune",
        "iphone repair pune",
        "samsung repair pune",
        "30 minute mobile repair",
        "quickfix pune",
        "sadashiv peth mobile repair",
      ],
    },
    hi: {
      title: "QuickFix.in | पुणे में 30 मिनट में डोरस्टेप मोबाइल रिपेयर",
      description:
        "पुणे में स्क्रीन, बैटरी व मोबाइल रिपेयर के लिए विश्वसनीय डोरस्टेप सेवा। 90 दिनों की वारंटी, 100% असली पार्ट्स, शून्य विजिट शुल्क और नो फिक्स नो फीस गारंटी।",
      keywords: [
        "मोबाइल रिपेयर पुणे",
        "डोरस्टेप मोबाइल रिपेयर",
        "स्क्रीन रिपेयर पुणे",
        "बैटरी रिप्लेसमेंट",
        "आईफोन रिपेयर पुणे",
        "सैमसंग रिपेयर पुणे",
      ],
    },
    mr: {
      title: "QuickFix.in | पुण्यात ३० मिनिटांत डोअरस्टेप मोबाईल रिपेअर",
      description:
        "पुण्यात स्क्रीन, बॅटरी व फोन दुरुस्तीसाठी जलद आणि विश्वासार्ह डोअरस्टेप सेवा. ९० दिवसांची वॉरंटी, ओरिजिनल स्पेअर पार्ट्स, मोफत व्हिजिट आणि नो फिक्स नो फी हमी.",
      keywords: [
        "मोबाईल रिपेअर पुणे",
        "डोअरस्टेप मोबाईल दुरुस्ती",
        "स्क्रीन बदलणे पुणे",
        "बॅटरी रिपेअर",
        "सदाशिव पेठ मोबाईल सर्व्हिस",
      ],
    },
  },
  repair: {
    en: {
      title: "Book Doorstep Mobile Repair | QuickFix.in Pune",
      description:
        "Schedule a certified smartphone repair technician to your doorstep anywhere in Pune. Fast 30-minute service at your home or office with genuine parts and 90-day warranty.",
      keywords: [
        "book mobile repair pune",
        "doorstep technician booking",
        "phone repair appointment pune",
        "instant phone repair booking",
      ],
    },
    hi: {
      title: "डोरस्टेप मोबाइल रिपेयर बुक करें | QuickFix.in पुणे",
      description:
        "पुणे में कहीं भी अपने घर या ऑफिस पर सर्टिफाइड मोबाइल टेक्नीशियन बुक करें। 30 मिनट में त्वरित सेवा, 90 दिनों की वारंटी और 100% असली पार्ट्स।",
      keywords: [
        "मोबाइल रिपेयर बुक करें",
        "डोरस्टेप बुकिंग पुणे",
        "फोन रिपेयर अपॉइंटमेंट",
      ],
    },
    mr: {
      title: "डोअरस्टेप मोबाईल रिपेअर बुक करा | QuickFix.in पुणे",
      description:
        "पुण्यात कुठेही तुमच्या घरी किंवा ऑफिसमध्ये मोबाईल दुरुस्तीसाठी तंत्रज्ञ बुक करा. ३० मिनिटांत जलद सेवा, ९० दिवसांची वॉरंटी आणि अस्सल पार्ट्स.",
      keywords: [
        "मोबाईल रिपेअर बुकिंग",
        "डोअरस्टेप फोन दुरुस्ती पुणे",
        "मोबाईल टेक्निशियन अपॉइंटमेंट",
      ],
    },
  },
  about: {
    en: {
      title: "About Us | QuickFix.in - Pune's Trusted Doorstep Repair Service",
      description:
        "Learn about QuickFix.in, Pune's premier doorstep smartphone repair service headquartered in Sadashiv Peth. Founded by Samadhan Patil with a mission of live in-front repair, speed, and genuine parts.",
      keywords: [
        "about quickfix pune",
        "samadhan patil mobile repair",
        "sadashiv peth quickfix",
        "doorstep phone repair history pune",
      ],
    },
    hi: {
      title: "हमारे बारे में | QuickFix.in - पुणे की विश्वसनीय डोरस्टेप रिपेयर सेवा",
      description:
        "सदाशिव पेठ, पुणे स्थित QuickFix.in के बारे में जानें। समाधान पाटिल द्वारा स्थापित, सामने लाइव रिपेयर, 30 मिनट की सर्विस और 100% असली पार्ट्स की गारंटी।",
      keywords: [
        "क्विकफिक्स पुणे के बारे में",
        "समाधान पाटिल",
        "डोरस्टेप रिपेयर पुणे",
      ],
    },
    mr: {
      title: "आमच्याबद्दल | QuickFix.in - पुण्यातील अग्रगण्य डोअरस्टेप मोबाईल सेवा",
      description:
        "सदाशिव पेठ, पुणे स्थित QuickFix.in विषयी अधिक जाणून घ्या. समाधान पाटील यांच्या नेतृत्वाखाली डोळ्यांदेखत लाईव्ह रिपेअर, ३० मिनिटांची गती आणि अस्सल पार्ट्सची खात्री.",
      keywords: [
        "क्विकफिक्स पुण्याबद्दल",
        "समाधान पाटील मोबाईल दुरुस्ती",
        "सदाशिव पेठ मोबाईल सेंटर",
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy | QuickFix.in Pune",
      description:
        "QuickFix.in privacy policy. Understand how we handle your device information, personal data, and service communications transparently and securely.",
      keywords: ["privacy policy", "quickfix data protection", "pune mobile repair privacy"],
    },
    hi: {
      title: "गोपनीयता नीति | QuickFix.in पुणे",
      description:
        "QuickFix.in गोपनीयता नीति। जानें कि हम आपके व्यक्तिगत डेटा और डिवाइस की जानकारी को सुरक्षित कैसे रखते हैं।",
      keywords: ["गोपनीयता नीति", "क्विकफिक्स डेटा सुरक्षा"],
    },
    mr: {
      title: "गोपनीयता धोरण | QuickFix.in पुणे",
      description:
        "QuickFix.in गोपनीयता धोरण. आम्ही तुमचा डेटा आणि मोबाईल माहिती सुरक्षित कशी ठेवतो याबद्दल माहिती.",
      keywords: ["गोपनीयता धोरण", "क्विकफिक्स डेटा सुरक्षा"],
    },
  },
  terms: {
    en: {
      title: "Terms of Service | QuickFix.in Pune",
      description:
        "Terms and conditions for doorstep mobile repair services provided by QuickFix.in across Pune, including our 90-day warranty and service guarantees.",
      keywords: ["terms of service", "repair warranty terms", "quickfix terms pune"],
    },
    hi: {
      title: "सेवा की शर्तें | QuickFix.in पुणे",
      description:
        "पुणे में QuickFix.in डोरस्टेप मोबाइल रिपेयर सेवा के नियम और शर्तें, 90 दिनों की वारंटी दिशानिर्देश।",
      keywords: ["सेवा शर्तें", "वारंटी नियम"],
    },
    mr: {
      title: "सेवा अटी | QuickFix.in पुणे",
      description:
        "QuickFix.in च्या डोअरस्टेप मोबाईल दुरुस्ती सेवेच्या अटी व शर्ती, ९० दिवसांची वॉरंटी माहिती.",
      keywords: ["सेवा अटी", "वॉरंटी नियम"],
    },
  },
  estimate: {
    en: {
      title: "Instant Repair Price Estimator | QuickFix.in Pune",
      description:
        "Calculate transparent, upfront smartphone repair pricing in Pune. Select your device brand, model, and issue for instant price calculation with 90-day warranty.",
      keywords: [
        "mobile repair price calculator",
        "phone repair cost pune",
        "screen replacement price pune",
        "battery replacement cost",
        "quickfix estimator",
      ],
    },
    hi: {
      title: "त्वरित मोबाइल रिपेयर मूल्य कैलकुलेटर | QuickFix.in पुणे",
      description:
        "पुणे में पारदर्शी और अग्रिम मोबाइल रिपेयर मूल्य जानें। अपने फोन का ब्रांड, मॉडल और समस्या चुनें और तुरंत दरें प्राप्त करें।",
      keywords: [
        "मोबाइल रिपेयर मूल्य कैलकुलेटर",
        "फोन रिपेयर खर्च पुणे",
        "स्क्रीन रिपेयर कीमत",
      ],
    },
    mr: {
      title: "त्वरित मोबाईल दुरुस्ती खर्च कॅल्क्युलेटर | QuickFix.in पुणे",
      description:
        "पुण्यात पारदर्शक आणि अचूक मोबाईल दुरुस्ती खर्च जाणून घ्या. आपला ब्रँड, मॉडेल आणि समस्या निवडून त्वरित अंदाज मिळवा.",
      keywords: [
        "मोबाईल दुरुस्ती खर्च कॅल्क्युलेटर",
        "फोन रिपेयर खर्च पुणे",
        "स्क्रीन बदलणे दर",
      ],
    },
  },
  contact: {
    en: {
      title: "Contact QuickFix.in | Phone Repair Helpline & Sadashiv Peth Hub",
      description:
        "Get in touch with QuickFix.in Pune. 1-tap phone helpline (+91 83086 86454), WhatsApp support, or visit our central Sadashiv Peth service center. 30-minute doorstep dispatch across Pune.",
      keywords: [
        "contact quickfix pune",
        "mobile repair helpline pune",
        "quickfix phone number",
        "sadashiv peth mobile repair shop",
        "doorstep phone repair contact",
      ],
    },
    hi: {
      title: "QuickFix.in से संपर्क करें | फोन रिपेयर हेल्पलाइन एवं सदाशिव पेठ केंद्र",
      description:
        "QuickFix.in पुणे से संपर्क करें। फोन हेल्पलाइन (+91 83086 86454), व्हाट्सएप सहायता या हमारे सदाशिव पेठ केंद्र पर आएं। पूरे पुणे में 30 मिनट में डोरस्टेप सेवा।",
      keywords: [
        "क्विकफिक्स पुणे संपर्क",
        "मोबाइल रिपेयर हेल्पलाइन",
        "सदाशिव पेठ मोबाइल शॉप",
      ],
    },
    mr: {
      title: "QuickFix.in शी संपर्क साधा | फोन दुरुस्ती हेल्पलाइन व सदाशिव पेठ केंद्र",
      description:
        "QuickFix.in पुणे यांच्याशी संपर्क साधा. हेल्पलाइन (+91 83086 86454), व्हॉट्सॲप सपोर्ट किंवा आमच्या सदाशिव पेठेतील मुख्य केंद्राला भेट द्या. पुण्यात ३० मिनिटांत डोअरस्टेप सेवा.",
      keywords: [
        "क्विकफिक्स संपर्क पुणे",
        "मोबाईल रिपेअर हेल्पलाइन",
        "सदाशिव पेठ मोबाईल दुरुस्ती केंद्र",
      ],
    },
  },
};

export interface SeoOptions {
  page: SeoPageKey;
  locale: string;
  path?: string;
  overrides?: Partial<Metadata>;
}

export function getSeoMetadata({
  page,
  locale,
  path = "",
  overrides = {},
}: SeoOptions): Metadata {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const entry = seoDictionaries[page][safeLocale];
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const currentUrl = `${siteUrl}/${safeLocale}${cleanPath === "/" ? "" : cleanPath}`;

  const ogLocaleMap = {
    en: "en_IN",
    hi: "hi_IN",
    mr: "mr_IN",
  };

  const metadata: Metadata = {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${siteUrl}/en${cleanPath === "/" ? "" : cleanPath}`,
        hi: `${siteUrl}/hi${cleanPath === "/" ? "" : cleanPath}`,
        mr: `${siteUrl}/mr${cleanPath === "/" ? "" : cleanPath}`,
        "x-default": `${siteUrl}/en${cleanPath === "/" ? "" : cleanPath}`,
      },
    },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: currentUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1000,
          height: 1000,
          alt: `${siteConfig.name} - Pune Doorstep Mobile Repair`,
          type: "image/png",
        },
      ],
      locale: ogLocaleMap[safeLocale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [siteConfig.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...overrides,
  };

  return metadata;
}

export interface CustomSeoOptions {
  title: string;
  description: string;
  keywords?: string[];
  locale: string;
  path: string;
  overrides?: Partial<Metadata>;
}

export function getCustomSeoMetadata({
  title,
  description,
  keywords = [],
  locale,
  path,
  overrides = {},
}: CustomSeoOptions): Metadata {
  const safeLocale = (
    ["en", "hi", "mr"].includes(locale) ? locale : "en"
  ) as "en" | "hi" | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const currentUrl = `${siteUrl}/${safeLocale}${cleanPath}`;

  const ogLocaleMap = {
    en: "en_IN",
    hi: "hi_IN",
    mr: "mr_IN",
  };

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${siteUrl}/en${cleanPath}`,
        hi: `${siteUrl}/hi${cleanPath}`,
        mr: `${siteUrl}/mr${cleanPath}`,
        "x-default": `${siteUrl}/en${cleanPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1000,
          height: 1000,
          alt: `${title} | ${siteConfig.name}`,
          type: "image/png",
        },
      ],
      locale: ogLocaleMap[safeLocale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...overrides,
  };
}

export function getServiceSeoMetadata({
  serviceName,
  startingPrice,
  turnaroundMinutes = 30,
  locale = "en",
  slug,
}: {
  serviceName: string;
  startingPrice: number;
  turnaroundMinutes?: number;
  locale?: string;
  slug: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: `${serviceName} in Pune | Doorstep in ${turnaroundMinutes} Mins | QuickFix.in`,
    hi: `${serviceName} पुणे | ${turnaroundMinutes} मिनट में डोरस्टेप रिपेयर | QuickFix.in`,
    mr: `${serviceName} पुणे | ${turnaroundMinutes} मिनिटांत डोअरस्टेप दुरुस्ती | QuickFix.in`,
  };

  const descriptions = {
    en: `Certified doorstep ${serviceName.toLowerCase()} in Pune starting from ₹${startingPrice}. Fixed in front of you within ${turnaroundMinutes} minutes with genuine OEM parts and 90-day warranty.`,
    hi: `पुणे में ₹${startingPrice} से प्रमाणित डोरस्टेप ${serviceName.toLowerCase()}। 100% असली पार्ट्स, 90 दिनों की वारंटी और 30 मिनट में सेवा।`,
    mr: `पुण्यात ₹${startingPrice} पासून अस्सल स्पेअर पार्ट्ससह डोअरस्टेप ${serviceName.toLowerCase()}. ३० मिनिटांत लाईव्ह रिपेअर आणि ९० दिवसांची वॉरंटी.`,
  };

  return getCustomSeoMetadata({
    title: titles[safeLocale as "en" | "hi" | "mr"],
    description: descriptions[safeLocale as "en" | "hi" | "mr"],
    keywords: [
      `${serviceName.toLowerCase()} pune`,
      `doorstep ${serviceName.toLowerCase()}`,
      "mobile repair pune",
      "phone service sadashiv peth",
    ],
    locale: safeLocale,
    path: `/services/${slug}`,
  });
}

export function getBrandSeoMetadata({
  brandName,
  locale = "en",
  slug,
}: {
  brandName: string;
  locale?: string;
  slug: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: `${brandName} Phone Repair Pune | Doorstep Service & OEM Parts | QuickFix.in`,
    hi: `${brandName} फोन रिपेयर पुणे | डोरस्टेप सर्विस व असली पार्ट्स | QuickFix.in`,
    mr: `${brandName} मोबाईल दुरुस्ती पुणे | डोअरस्टेप सेवा व अस्सल पार्ट्स | QuickFix.in`,
  };

  const descriptions = {
    en: `Expert doorstep mobile repairs for ${brandName} smartphones across all Pune areas. Screen, battery, and camera replacements done live in 30 minutes with 90-day warranty.`,
    hi: `पुणे में ${brandName} स्मार्टफोन के लिए विश्वसनीय डोरस्टेप रिपेयर। 30 मिनट में स्क्रीन व बैटरी रिप्लेसमेंट, 90 दिनों की वारंटी।`,
    mr: `पुण्यात ${brandName} फोनसाठी जलद डोअरस्टेप दुरुस्ती. ३० मिनिटांत स्क्रीन व बॅटरी बदल, ९० दिवसांची वॉरंटी आणि डेटा सुरक्षितता.`,
  };

  return getCustomSeoMetadata({
    title: titles[safeLocale as "en" | "hi" | "mr"],
    description: descriptions[safeLocale as "en" | "hi" | "mr"],
    keywords: [
      `${brandName.toLowerCase()} repair pune`,
      `${brandName.toLowerCase()} screen replacement`,
      `doorstep ${brandName.toLowerCase()} service pune`,
    ],
    locale: safeLocale,
    path: `/brands/${slug}`,
  });
}

export function getLocationSeoMetadata({
  localityName,
  zoneName,
  dispatchTime = "30 Mins",
  locale = "en",
  slug,
}: {
  localityName: string;
  zoneName?: string;
  dispatchTime?: string;
  locale?: string;
  slug: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: `Doorstep Mobile Repair in ${localityName}, Pune | ${dispatchTime} Dispatch | QuickFix.in`,
    hi: `${localityName}, पुणे में डोरस्टेप मोबाइल रिपेयर | ${dispatchTime} में टेक्नीशियन | QuickFix.in`,
    mr: `${localityName}, पुणे येथे डोअरस्टेप मोबाईल दुरुस्ती | ${dispatchTime} जलद पोहोच | QuickFix.in`,
  };

  const descriptions = {
    en: `Need fast smartphone repair in ${localityName}, Pune? Certified technician dispatched in ${dispatchTime}. Screen, battery, and port repairs done in 30 minutes with 90-day warranty.`,
    hi: `${localityName}, पुणे में अपने घर पर मोबाइल रिपेयर करवाएं। ${dispatchTime} में टेक्नीशियन आगमन, 90 दिनों की वारंटी और नो फिक्स नो फीस।`,
    mr: `${localityName}, पुणे येथे तुमच्या घरी फोन दुरुस्ती. ${dispatchTime} मध्ये तंत्रज्ञ उपस्थित, ९० दिवसांची वॉरंटी आणि मोफत व्हिजिट.`,
  };

  return getCustomSeoMetadata({
    title: titles[safeLocale as "en" | "hi" | "mr"],
    description: descriptions[safeLocale as "en" | "hi" | "mr"],
    keywords: [
      `mobile repair ${localityName.toLowerCase()} pune`,
      `phone screen repair ${localityName.toLowerCase()}`,
      `doorstep phone service ${localityName.toLowerCase()}`,
    ],
    locale: safeLocale,
    path: `/locations/${slug}`,
  });
}
