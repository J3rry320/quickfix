import Image from "next/image";
import { useTranslations } from "next-intl";
import { Phone, Clock, MapPin, MessageSquare, ShieldCheck, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import contactConfig from "@/config/contact";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-tech-slate text-clean-white pt-12 sm:pt-16 pb-24 md:pb-12 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="QuickFix.in Logo"
                width={42}
                height={42}
                className="h-10 w-10 object-contain rounded-xl"
              />
              <span className="font-heading text-xl font-black text-clean-white tracking-tight">
                QuickFix<span className="text-flash-orange">.in</span>
              </span>
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-body leading-relaxed max-w-sm">
              {t("brandDesc")}
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-electric-amber">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Pune Express Doorstep Coverage</span>
            </div>

            {/* Social Media Links from contactConfig */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Follow & Connect
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={contactConfig.social.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 hover:bg-emerald-600 hover:text-clean-white transition-colors"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.19 1.564 5.946l-1.664 6.082 6.221-1.632c1.707.935 3.666 1.465 5.751 1.465 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href={contactConfig.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 hover:bg-pink-600 hover:text-clean-white transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={contactConfig.social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 hover:bg-blue-600 hover:text-clean-white transition-colors"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                  </svg>
                </a>
                <a
                  href={contactConfig.social.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-clean-white transition-colors"
                  aria-label="X (Twitter)"
                  title="X (Twitter)"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={contactConfig.social.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 hover:bg-red-600 hover:text-clean-white transition-colors"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href={contactConfig.social.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 hover:bg-sky-600 hover:text-clean-white transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Repairs Directory */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-clean-white mb-4">
              {t("services")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400 font-medium">
              <li>
                <Link href="/services/screen-replacement" className="hover:text-flash-orange transition-colors">
                  {t("screenRepair")}
                </Link>
              </li>
              <li>
                <Link href="/services/battery-replacement" className="hover:text-flash-orange transition-colors">
                  {t("batteryReplacement")}
                </Link>
              </li>
              <li>
                <Link href="/services/charging-port" className="hover:text-flash-orange transition-colors">
                  {t("chargingPort")}
                </Link>
              </li>
              <li>
                <Link href="/services/front-rear-camera" className="hover:text-flash-orange transition-colors">
                  {t("cameraRepair")}
                </Link>
              </li>
              <li>
                <Link href="/services/motherboard-chip-level" className="hover:text-flash-orange transition-colors">
                  {t("motherboardRepair")}
                </Link>
              </li>
              <li>
                <Link href="/services/water-damage-rescue" className="hover:text-flash-orange transition-colors">
                  {t("waterDamage")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-clean-white mb-4">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400 font-medium">
              <li>
                <Link href="/about" className="hover:text-flash-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-flash-orange transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/book-repair" className="hover:text-flash-orange transition-colors">
                  Book Doorstep
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-flash-orange transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-flash-orange transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Pune Contact & Hotline */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-clean-white mb-4">
              {t("contactInfo")}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-flash-orange shrink-0" />
                <a href={`tel:${contactConfig.phone.value}`} className="font-bold text-clean-white hover:text-flash-orange transition-colors">
                  {contactConfig.phone.display}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-flash-orange shrink-0" />
                <a
                  href={contactConfig.whatsapp.getDefaultUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-clean-white hover:text-flash-orange transition-colors"
                >
                  WhatsApp Quick Support
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-flash-orange shrink-0" />
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="font-bold text-clean-white hover:text-flash-orange transition-colors"
                >
                  {contactConfig.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-flash-orange shrink-0 mt-0.5" />
                <span>{contactConfig.hours.display}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-flash-orange shrink-0 mt-0.5" />
                <span className="text-zinc-400 text-xs">
                  {contactConfig.address.full}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-zinc-400 text-xs">
                  {contactConfig.serviceAreas.doorstepSla}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-clean-white transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-clean-white transition-colors">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
