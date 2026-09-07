import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getSeoMetadata } from "@/config/seo";
import {
  getOrganizationAndLocalBusinessSchema,
  getWebsiteSchema,
} from "@/config/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import MobileActionBar from "@/components/MobileActionBar";
import "@/app/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata({ page: "landing", locale, path: "/" });
}

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all merged messages to the client
  const messages = await getMessages();

  const localBusinessSchema = getOrganizationAndLocalBusinessSchema(locale);
  const websiteSchema = getWebsiteSchema(locale);

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="antialiased min-h-screen bg-base-surface text-dark-neutral font-body flex flex-col">
        <JsonLd
          schema={[localBusinessSchema, websiteSchema]}
          id="root-structured-data"
        />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFab />
          <MobileActionBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
