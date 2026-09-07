import type { Metadata } from "next";

export const siteConfig = {
  name: "QuickFix.in",
  legalName: "QuickFix Mobile Solutions",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://quickfix.in",
  defaultOgImage: "/logo.png",
  supportedLocales: ["en", "hi", "mr"] as const,
  defaultLocale: "en",
};

export type SeoPageKey = "landing" | "repair" | "about";

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
