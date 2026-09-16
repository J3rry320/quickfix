import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

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

export const metadata: Metadata = {
  title: "QuickFixMobile.in | Admin Portal",
  description: "Secure Admin Management Portal for QuickFixMobile.in",
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-mist-gray text-tech-slate font-body flex flex-col w-full max-w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
