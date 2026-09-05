import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import "@/app/globals.css";

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
  const isMr = locale === "mr";
  const isHi = locale === "hi";

  return {
    title: isMr
      ? "QuickFix.in | पुण्यात ३० मिनिटांत डोअरस्टेप मोबाईल रिपेअर"
      : isHi
      ? "QuickFix.in | पुणे में 30 मिनट में डोरस्टेप मोबाइल रिपेयर"
      : "QuickFix.in | 30-Minute Doorstep Mobile Repair in Pune",
    description: isMr
      ? "पुण्यात स्क्रीन, बॅटरी व फोन दुरुस्तीसाठी जलद आणि विश्वासार्ह डोअरस्टेप सेवा. ९० दिवसांची वॉरंटी आणि ओरिजिनल पार्ट्स."
      : isHi
      ? "पुणे में स्क्रीन, बैटरी व मोबाइल रिपेयर के लिए विश्वसनीय डोरस्टेप सेवा। 90 दिनों की वारंटी और 100% असली पार्ट्स।"
      : "Fast, reliable doorstep mobile repairs across Pune in 30 minutes with genuine parts and 90-day warranty.",
  };
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

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="antialiased min-h-screen bg-base-surface text-dark-neutral font-body flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFab />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
