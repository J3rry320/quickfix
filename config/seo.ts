import type { Metadata } from "next";

export const siteConfig = {
  name: "Quick Fix",
  legalName: "Quick Fix Mobile Solutions",
  domain: "quickfixmobile.in",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://quickfixmobile.in",
  defaultOgImage: "/logo.png",
  supportedLocales: ["en", "hi", "mr"] as const,
  defaultLocale: "en",
};

export type SeoPageKey =
  | "landing"
  | "repair"
  | "about"
  | "privacy"
  | "terms"
  | "estimate"
  | "contact"
  | "track"
  | "reviews";

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
      title:
        "QuickFixMobile.in | Doorstep Mobile Pickup & Certified Lab Repair in Pune",
      description:
        "Doorstep smartphone pickup across Pune, precision repair at our certified central lab with genuine OEM parts, transparent pricing, and 90-day warranty. Screen, battery, and camera fixes.",
      keywords: [
        "doorstep mobile repair",
        "mobile repair pune",
        "phone pickup and repair pune",
        "iphone repair pune",
        "samsung repair pune",
        "30 minute mobile repair",
        "quickfix pune",
        "sadashiv peth mobile repair",
      ],
    },
    hi: {
      title: "QuickFixMobile.in | पुणे में 30 मिनट में डोरस्टेप मोबाइल रिपेयर",
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
      title: "QuickFixMobile.in | पुण्यात ३० मिनिटांत डोअरस्टेप मोबाईल रिपेअर",
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
      title: "Book Doorstep Mobile Repair & Pickup | QuickFixMobile.in Pune",
      description:
        "Schedule certified smartphone pickup from your doorstep anywhere in Pune. Lab-grade repairs in Sadashiv Peth with genuine parts, 90-day warranty, and same-day delivery.",
      keywords: [
        "book mobile repair pune",
        "doorstep pickup mobile repair",
        "phone repair appointment pune",
        "instant phone repair booking",
      ],
    },
    hi: {
      title: "डोरस्टेप मोबाइल पिकअप व रिपेयर बुक करें | QuickFixMobile.in पुणे",
      description:
        "पुणे में कहीं भी अपने घर या ऑफिस से सर्टिफाइड मोबाइल पिकअप बुक करें। सदाशिव पेठ लैब में रिपेयर, 90 दिनों की वारंटी और 100% असली पार्ट्स।",
      keywords: [
        "मोबाइल रिपेयर बुक करें",
        "डोरस्टेप पिकअप पुणे",
        "फोन रिपेयर अपॉइंटमेंट",
      ],
    },
    mr: {
      title:
        "डोअरस्टेप मोबाईल पिकअप व दुरुस्ती बुक करा | QuickFixMobile.in पुणे",
      description:
        "पुण्यात कुठेही तुमच्या घरी किंवा ऑफिसमधून मोबाईल पिकअप बुक करा. सदाशिव पेठ लॅबमध्ये दुरुस्ती, ९० दिवसांची वॉरंटी आणि अस्सल पार्ट्स.",
      keywords: [
        "मोबाईल रिपेअर बुकिंग",
        "डोअरस्टेप पिकअप पुणे",
        "मोबाईल दुरुस्ती अपॉइंटमेंट",
      ],
    },
  },
  about: {
    en: {
      title:
        "About Us | QuickFixMobile.in - Pune's Trusted Doorstep Repair Service",
      description:
        "Learn about QuickFixMobile.in, Pune's premier doorstep smartphone pickup and repair service headquartered in Sadashiv Peth. Founded by Samadhan Patil with a mission of certified lab precision, data privacy, and genuine parts.",
      keywords: [
        "about quickfix pune",
        "samadhan patil mobile repair",
        "sadashiv peth quickfix",
        "doorstep phone repair history pune",
      ],
    },
    hi: {
      title:
        "हमारे बारे में | QuickFixMobile.in - पुणे की विश्वसनीय डोरस्टेप रिपेयर सेवा",
      description:
        "सदाशिव पेठ, पुणे स्थित QuickFixMobile.in के बारे में जानें। समाधान पाटिल द्वारा स्थापित, सुरक्षित पिकअप, सर्टिफाइड पुणे लैब रिपेयर और 100% असली पार्ट्स की गारंटी।",
      keywords: [
        "क्विकफिक्स पुणे के बारे में",
        "समाधान पाटिल",
        "डोरस्टेप रिपेयर पुणे",
      ],
    },
    mr: {
      title:
        "आमच्याबद्दल | QuickFixMobile.in - पुण्यातील अग्रगण्य डोअरस्टेप मोबाईल सेवा",
      description:
        "सदाशिव पेठ, पुणे स्थित QuickFixMobile.in विषयी अधिक जाणून घ्या. समाधान पाटील यांच्या नेतृत्वाखाली सुरक्षित घरपोच पिकअप, प्रमाणित लॅब दुरुस्ती आणि अस्सल पार्ट्सची खात्री.",
      keywords: [
        "क्विकफिक्स पुण्याबद्दल",
        "समाधान पाटील मोबाईल दुरुस्ती",
        "सदाशिव पेठ मोबाईल सेंटर",
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy | QuickFixMobile.in Pune",
      description:
        "QuickFixMobile.in privacy policy. Understand how we handle your device information, personal data, and service communications transparently and securely.",
      keywords: [
        "privacy policy",
        "quickfix data protection",
        "pune mobile repair privacy",
      ],
    },
    hi: {
      title: "गोपनीयता नीति | QuickFixMobile.in पुणे",
      description:
        "QuickFixMobile.in गोपनीयता नीति। जानें कि हम आपके व्यक्तिगत डेटा और डिवाइस की जानकारी को सुरक्षित कैसे रखते हैं।",
      keywords: ["गोपनीयता नीति", "क्विकफिक्स डेटा सुरक्षा"],
    },
    mr: {
      title: "गोपनीयता धोरण | QuickFixMobile.in पुणे",
      description:
        "QuickFixMobile.in गोपनीयता धोरण. आम्ही तुमचा डेटा आणि मोबाईल माहिती सुरक्षित कशी ठेवतो याबद्दल माहिती.",
      keywords: ["गोपनीयता धोरण", "क्विकफिक्स डेटा सुरक्षा"],
    },
  },
  terms: {
    en: {
      title: "Terms of Service | QuickFixMobile.in Pune",
      description:
        "Terms and conditions for doorstep mobile repair services provided by QuickFixMobile.in across Pune, including our 90-day warranty and service guarantees.",
      keywords: [
        "terms of service",
        "repair warranty terms",
        "quickfix terms pune",
      ],
    },
    hi: {
      title: "सेवा की शर्तें | QuickFixMobile.in पुणे",
      description:
        "पुणे में QuickFixMobile.in डोरस्टेप मोबाइल रिपेयर सेवा के नियम और शर्तें, 90 दिनों की वारंटी दिशानिर्देश।",
      keywords: ["सेवा शर्तें", "वारंटी नियम"],
    },
    mr: {
      title: "सेवा अटी | QuickFixMobile.in पुणे",
      description:
        "QuickFixMobile.in च्या डोअरस्टेप मोबाईल दुरुस्ती सेवेच्या अटी व शर्ती, ९० दिवसांची वॉरंटी माहिती.",
      keywords: ["सेवा अटी", "वॉरंटी नियम"],
    },
  },
  estimate: {
    en: {
      title: "Instant Repair Price Estimator | QuickFixMobile.in Pune",
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
      title: "त्वरित मोबाइल रिपेयर मूल्य कैलकुलेटर | QuickFixMobile.in पुणे",
      description:
        "पुणे में पारदर्शी और अग्रिम मोबाइल रिपेयर मूल्य जानें। अपने फोन का ब्रांड, मॉडल और समस्या चुनें और तुरंत दरें प्राप्त करें।",
      keywords: [
        "मोबाइल रिपेयर मूल्य कैलकुलेटर",
        "फोन रिपेयर खर्च पुणे",
        "स्क्रीन रिपेयर कीमत",
      ],
    },
    mr: {
      title:
        "त्वरित मोबाईल दुरुस्ती खर्च कॅल्क्युलेटर | QuickFixMobile.in पुणे",
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
      title:
        "Contact QuickFixMobile.in | Phone Repair Helpline & Sadashiv Peth Hub",
      description:
        "Get in touch with QuickFixMobile.in Pune. 1-tap phone helpline (+91 83086 86454), WhatsApp support, or visit our central Sadashiv Peth service center. 30-minute doorstep dispatch across Pune.",
      keywords: [
        "contact quickfix pune",
        "mobile repair helpline pune",
        "quickfix phone number",
        "sadashiv peth mobile repair shop",
        "doorstep phone repair contact",
      ],
    },
    hi: {
      title:
        "QuickFixMobile.in से संपर्क करें | फोन रिपेयर हेल्पलाइन एवं सदाशिव पेठ केंद्र",
      description:
        "QuickFixMobile.in पुणे से संपर्क करें। फोन हेल्पलाइन (+91 83086 86454), व्हाट्सएप सहायता या हमारे सदाशिव पेठ केंद्र पर आएं। पूरे पुणे में 30 मिनट में डोरस्टेप सेवा।",
      keywords: [
        "क्विकफिक्स पुणे संपर्क",
        "मोबाइल रिपेयर हेल्पलाइन",
        "सदाशिव पेठ मोबाइल शॉप",
      ],
    },
    mr: {
      title:
        "QuickFixMobile.in शी संपर्क साधा | फोन दुरुस्ती हेल्पलाइन व सदाशिव पेठ केंद्र",
      description:
        "QuickFixMobile.in पुणे यांच्याशी संपर्क साधा. हेल्पलाइन (+91 83086 86454), व्हॉट्सॲप सपोर्ट किंवा आमच्या सदाशिव पेठेतील मुख्य केंद्राला भेट द्या. पुण्यात ३० मिनिटांत डोअरस्टेप सेवा.",
      keywords: [
        "क्विकफिक्स संपर्क पुणे",
        "मोबाईल रिपेअर हेल्पलाइन",
        "सदाशिव पेठ मोबाईल दुरुस्ती केंद्र",
      ],
    },
  },
  track: {
    en: {
      title: "Track Device Repair Status | QuickFixMobile.in Pune",
      description:
        "Live tracking for your smartphone repair in Pune. Enter your QuickFix booking reference code for real-time status updates.",
      keywords: [
        "track phone repair",
        "repair status pune",
        "quickfix tracking",
        "mobile repair status",
        "track repair order",
      ],
    },
    hi: {
      title: "मोबाइल रिपेयर स्थिति ट्रैक करें | QuickFixMobile.in पुणे",
      description:
        "पुणे में अपने स्मार्टफोन रिपेयर की स्थिति लाइव ट्रैक करें। रियल-टाइम अपडेट के लिए अपना क्विकफिक्स बुकिंग कोड दर्ज करें।",
      keywords: [
        "मोबाइल रिपेयर ट्रैकिंग",
        "फोन रिपेयर स्टेटस",
        "क्विकफिक्स ट्रैकिंग",
      ],
    },
    mr: {
      title: "मोबाईल दुरुस्ती स्थिती ट्रॅक करा | QuickFixMobile.in पुणे",
      description:
        "पुण्यात आपल्या स्मार्टफोन दुरुस्तीची थेट स्थिती ट्रॅक करा. रिअल-टाइम अपडेटसाठी आपला क्विकफिक्स बुकिंग संदर्भ कोड प्रविष्ट करा.",
      keywords: [
        "मोबाईल दुरुस्ती ट्रॅकिंग",
        "फोन दुरुस्ती स्टेटस",
        "क्विकफिक्स ट्रॅकिंग",
      ],
    },
  },
  reviews: {
    en: {
      title: "Customer Reviews & Ratings | QuickFixMobile.in Pune",
      description:
        "Verified customer reviews and ratings for QuickFix doorstep mobile repair services across Pune. Read real feedback and share your experience.",
      keywords: [
        "quickfix reviews",
        "mobile repair reviews pune",
        "phone repair ratings",
        "customer feedback pune",
        "doorstep repair reviews",
      ],
    },
    hi: {
      title: "ग्राहक समीक्षाएं एवं रेटिंग्स | QuickFixMobile.in पुणे",
      description:
        "पुणे में क्विकफिक्स डोरस्टेप मोबाइल रिपेयर सेवा के लिए सत्यापित ग्राहकों की समीक्षाएं और रेटिंग्स पढ़ें व अपना अनुभव साझा करें।",
      keywords: [
        "क्विकफिक्स समीक्षाएं",
        "मोबाइल रिपेयर रेटिंग",
        "ग्राहक फीडबैक",
      ],
    },
    mr: {
      title: "ग्राहक अभिप्राय आणि रेटिंग्ज | QuickFixMobile.in पुणे",
      description:
        "पुण्यातील क्विकफिक्स डोअरस्टेप मोबाईल दुरुस्ती सेवेसाठी पडताळलेले ग्राहक अभिप्राय आणि रेटिंग्ज वाचा व आपला अनुभव नोंदवा.",
      keywords: [
        "क्विकफिक्स रिव्ह्यू",
        "मोबाईल दुरुस्ती रेटिंग",
        "ग्राहक अभिप्राय",
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
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
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
    manifest: "/manifest.json",
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
          url: `${siteUrl}${siteConfig.defaultOgImage}`,
          width: 1200,
          height: 630,
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
      images: [`${siteUrl}${siteConfig.defaultOgImage}`],
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
  image?: string;
  overrides?: Partial<Metadata>;
}

export function getCustomSeoMetadata({
  title,
  description,
  keywords = [],
  locale,
  path,
  image,
  overrides = {},
}: CustomSeoOptions): Metadata {
  const safeLocale = (["en", "hi", "mr"].includes(locale) ? locale : "en") as
    | "en"
    | "hi"
    | "mr";
  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const currentUrl = `${siteUrl}/${safeLocale}${cleanPath}`;

  const ogLocaleMap = {
    en: "en_IN",
    hi: "hi_IN",
    mr: "mr_IN",
  };

  const imageUrl =
    image && image.trim()
      ? image.startsWith("http://") || image.startsWith("https://")
        ? image
        : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`
      : `${siteUrl}${siteConfig.defaultOgImage}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    manifest: "/manifest.json",
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
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | ${siteConfig.name}`,
        },
      ],
      locale: ogLocaleMap[safeLocale],
      type: "website",
      ...overrides.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      ...overrides.twitter,
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
  image,
}: {
  serviceName: string;
  startingPrice: number;
  turnaroundMinutes?: number;
  locale?: string;
  slug: string;
  image?: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: `${serviceName} in Pune | Doorstep in ${turnaroundMinutes} Mins | Quick Fix`,
    hi: `${serviceName} पुणे | ${turnaroundMinutes} मिनट में डोरस्टेप रिपेयर | Quick Fix`,
    mr: `${serviceName} पुणे | ${turnaroundMinutes} मिनिटांत डोअरस्टेप दुरुस्ती | Quick Fix`,
  };

  const descriptions = {
    en: `Certified doorstep pickup & ${serviceName.toLowerCase()} in Pune starting from ₹${startingPrice}. Repaired in our central Pune lab with genuine OEM parts, same-day doorstep return, and 90-day warranty.`,
    hi: `पुणे में ₹${startingPrice} से प्रमाणित डोरस्टेप पिकअप और ${serviceName.toLowerCase()}। 100% असली पार्ट्स, 90 दिनों की वारंटी और उसी दिन डिलीवरी।`,
    mr: `पुण्यात ₹${startingPrice} पासून अस्सल स्पेअर पार्ट्ससह डोअरस्टेप पिकअप आणि ${serviceName.toLowerCase()}. मध्यवर्ती लॅब दुरुस्ती आणि ९० दिवसांची वॉरंटी.`,
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
    image,
  });
}

export function getBrandSeoMetadata({
  brandName,
  locale = "en",
  slug,
  image,
}: {
  brandName: string;
  locale?: string;
  slug: string;
  image?: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: `${brandName} Phone Repair Pune | Doorstep Service & OEM Parts | Quick Fix`,
    hi: `${brandName} फोन रिपेयर पुणे | डोरस्टेप सर्विस व असली पार्ट्स | Quick Fix`,
    mr: `${brandName} मोबाईल दुरुस्ती पुणे | डोअरस्टेप सेवा व अस्सल पार्ट्स | Quick Fix`,
  };

  const descriptions = {
    en: `Expert doorstep pickup and certified lab repairs for ${brandName} smartphones across Pune. Screen, battery, and camera replacements with OEM-grade parts and 90-day warranty.`,
    hi: `पुणे में ${brandName} स्मार्टफोन के लिए विश्वसनीय डोरस्टेप पिकअप और लैब रिपेयर। OEM पार्ट्स और 90 दिनों की वारंटी।`,
    mr: `पुण्यात ${brandName} फोनसाठी जलद डोअरस्टेप पिकअप आणि लॅब दुरुस्ती. OEM पार्ट्स, ९० दिवसांची वॉरंटी आणि डेटा सुरक्षितता.`,
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
    image,
  });
}

export function getLocationSeoMetadata({
  localityName,
  zoneName,
  dispatchTime = "30 Mins",
  locale = "en",
  slug,
  image,
}: {
  localityName: string;
  zoneName?: string;
  dispatchTime?: string;
  locale?: string;
  slug: string;
  image?: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";
  const zoneInfo = zoneName ? ` (${zoneName} Zone)` : "";

  const titles = {
    en: `Doorstep Mobile Repair in ${localityName}, Pune | ${dispatchTime} Pickup | Quick Fix`,
    hi: `${localityName}, पुणे में डोरस्टेप मोबाइल पिकअप व रिपेयर | ${dispatchTime} में पिकअप | Quick Fix`,
    mr: `${localityName}, पुणे येथे डोअरस्टेप मोबाईल दुरुस्ती | ${dispatchTime} पिकअप | Quick Fix`,
  };

  const descriptions = {
    en: `Need fast smartphone repair in ${localityName}, Pune${zoneInfo}? Convenient doorstep pickup within ${dispatchTime}. Screen, battery, and motherboard repairs at our Sadashiv Peth lab with 90-day warranty.`,
    hi: `${localityName}, पुणे में अपने घर से मोबाइल पिकअप करवाएं। ${dispatchTime} में पिकअप, 90 दिनों की वारंटी और नो फिक्स नो फीस।`,
    mr: `${localityName}, पुणे येथे तुमच्या घरून फोन पिकअप. ${dispatchTime} मध्ये पिकअप, ९० दिवसांची वॉरंटी आणि मोफत व्हिजिट.`,
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
    image: image || `/locations/${slug}/opengraph-image`,
  });
}

export function getModelSeoMetadata({
  brandName,
  modelName,
  brandSlug,
  modelSlug,
  locale = "en",
  image,
}: {
  brandName: string;
  modelName: string;
  brandSlug: string;
  modelSlug: string;
  locale?: string;
  image?: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: `${modelName} Repair in Pune | Doorstep Pickup from ₹699 | Quick Fix`,
    hi: `${modelName} रिपेयर पुणे | डोरस्टेप पिकअप ₹699 से | Quick Fix`,
    mr: `${modelName} दुरुस्ती पुणे | डोअरस्टेप पिकअप ₹699 पासून | Quick Fix`,
  };

  const descriptions = {
    en: `Professional repair for ${modelName} in Pune. Convenient doorstep pickup, certified lab repair with genuine OEM parts, and safe same-day return with 90-day warranty.`,
    hi: `पुणे में ${modelName} के लिए प्रमाणित रिपेयर। डोरस्टेप पिकअप, लैब में असली पार्ट्स के साथ मरम्मत और 90 दिनों की वारंटी।`,
    mr: `पुण्यात ${modelName} साठी प्रमाणित दुरुस्ती. डोअरस्टेप पिकअप, अस्सल पार्ट्ससह लॅब दुरुस्ती आणि ९० दिवसांची हमी.`,
  };

  return getCustomSeoMetadata({
    title: titles[safeLocale as "en" | "hi" | "mr"],
    description: descriptions[safeLocale as "en" | "hi" | "mr"],
    keywords: [
      `${modelName.toLowerCase()} repair pune`,
      `${modelName.toLowerCase()} screen replacement`,
      `${brandName.toLowerCase()} repair pune`,
      `doorstep ${modelName.toLowerCase()} service`,
    ],
    locale: safeLocale,
    path: `/brands/${brandSlug}/${modelSlug}`,
    image,
  });
}

export function getServicesHubSeoMetadata({
  locale = "en",
}: {
  locale?: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: "All Smartphone Repair Services in Pune | Quick Fix",
    hi: "पुणे में सभी स्मार्टफोन रिपेयर सेवाएं | Quick Fix",
    mr: "पुण्यातील सर्व स्मार्टफोन दुरुस्ती सेवा | Quick Fix",
  };

  const descriptions = {
    en: "Browse all mobile repair services in Pune with doorstep pickup — screen replacement, battery swap, charging port, camera, motherboard & more. Transparent pricing, 90-day warranty.",
    hi: "पुणे में सभी डोरस्टेप मोबाइल रिपेयर सेवाएं — स्क्रीन, बैटरी, चार्जिंग पोर्ट, कैमरा, मदरबोर्ड। 90 दिनों की वारंटी।",
    mr: "पुण्यात सर्व डोअरस्टेप मोबाईल दुरुस्ती सेवा — स्क्रीन, बॅटरी, चार्जिंग पोर्ट, कॅमेरा, मदरबोर्ड. ९० दिवसांची वॉरंटी.",
  };

  return getCustomSeoMetadata({
    title: titles[safeLocale as "en" | "hi" | "mr"],
    description: descriptions[safeLocale as "en" | "hi" | "mr"],
    keywords: [
      "mobile repair services pune",
      "phone repair pune",
      "doorstep repair services",
    ],
    locale: safeLocale,
    path: "/services",
  });
}

export function getBrandsHubSeoMetadata({
  locale = "en",
}: {
  locale?: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: "All Smartphone Brands We Repair in Pune | Quick Fix",
    hi: "पुणे में सभी स्मार्टफोन ब्रांड रिपेयर | Quick Fix",
    mr: "पुण्यात सर्व स्मार्टफोन ब्रँड दुरुस्ती | Quick Fix",
  };

  const descriptions = {
    en: "We provide doorstep pickup and certified lab repair for Apple iPhone, Samsung Galaxy, OnePlus, Xiaomi, Google Pixel, Vivo, Oppo & more across Pune. OEM parts, 90-day warranty.",
    hi: "पुणे में Apple iPhone, Samsung Galaxy, OnePlus, Xiaomi और सभी प्रमुख ब्रांड के लिए डोरस्टेप पिकअप और लैब रिपेयर। OEM पार्ट्स, 90 दिनों की वारंटी।",
    mr: "पुण्यात Apple iPhone, Samsung Galaxy, OnePlus, Xiaomi आणि सर्व प्रमुख ब्रँडसाठी डोअरस्टेप पिकअप आणि लॅब दुरुस्ती. OEM पार्ट्स, ९० दिवसांची वॉरंटी.",
  };

  return getCustomSeoMetadata({
    title: titles[safeLocale as "en" | "hi" | "mr"],
    description: descriptions[safeLocale as "en" | "hi" | "mr"],
    keywords: [
      "smartphone brands repair pune",
      "iphone repair pune",
      "samsung repair pune",
    ],
    locale: safeLocale,
    path: "/brands",
  });
}

export function getLocationsHubSeoMetadata({
  locale = "en",
}: {
  locale?: string;
}): Metadata {
  const safeLocale = ["en", "hi", "mr"].includes(locale) ? locale : "en";

  const titles = {
    en: "Pune Mobile Repair Service Areas & Doorstep Coverage | Quick Fix",
    hi: "पुणे में मोबाइल रिपेयर सेवा क्षेत्र व डोरस्टेप कवरेज | Quick Fix",
    mr: "पुण्यातील मोबाईल दुरुस्ती सेवा परिसर आणि डोअरस्टेप कव्हरेज | Quick Fix",
  };

  const descriptions = {
    en: "Find certified doorstep mobile repair pickup across 30+ Pune localities in West, East, Central, South, and PCMC Pune. Rapid 15-40 min pickup, genuine OEM parts, and 90-day warranty.",
    hi: "पश्चिम, पूर्व, मध्य, दक्षिण और PCMC पुणे के 30+ इलाकों में प्रमाणित डोरस्टेप मोबाइल रिपेयर पिकअप। 15-40 मिनट में पिकअप, OEM पार्ट्स और 90 दिनों की वारंटी।",
    mr: "पश्चिम, पूर्व, मध्य, दक्षिण आणि PCMC पुण्यातील ३०+ भागांमध्ये प्रमाणित डोअरस्टेप मोबाईल दुरुस्ती पिकअप. १५-४० मिनिटांत पिकअप, OEM पार्ट्स आणि ९० दिवसांची वॉरंटी.",
  };

  return getCustomSeoMetadata({
    title: titles[safeLocale as "en" | "hi" | "mr"],
    description: descriptions[safeLocale as "en" | "hi" | "mr"],
    keywords: [
      "mobile repair pune locations",
      "phone repair service areas pune",
      "doorstep phone repair pune",
      "kothrud mobile repair",
      "baner mobile repair",
      "wakad mobile repair",
      "hadapsar mobile repair",
      "viman nagar mobile repair",
    ],
    locale: safeLocale,
    path: "/locations",
  });
}
