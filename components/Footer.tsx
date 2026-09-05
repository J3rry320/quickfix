import { useTranslations } from "next-intl";
import { Wrench, Phone, Clock, MapPin, MessageSquare, ShieldCheck, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import contactConfig from "@/config/contact";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-tech-slate text-clean-white pt-16 pb-12 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-flash-orange text-clean-white shadow-md">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-black text-clean-white tracking-tight">
                QuickFix<span className="text-flash-orange">.in</span>
              </span>
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-zinc-400 font-body leading-relaxed max-w-sm">
              {t("brandDesc")}
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-electric-amber">
              <ShieldCheck className="h-4 w-4" />
              <span>Pune Express Doorstep Coverage</span>
            </div>
          </div>

          {/* Repairs Directory */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-xs font-extrabold uppercase tracking-wider text-clean-white mb-4">
              {t("services")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400 font-medium">
              <li>
                <a href="#services" className="hover:text-flash-orange transition-colors">
                  {t("screenRepair")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-flash-orange transition-colors">
                  {t("batteryReplacement")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-flash-orange transition-colors">
                  {t("chargingPort")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-flash-orange transition-colors">
                  {t("cameraRepair")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-flash-orange transition-colors">
                  {t("motherboardRepair")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-flash-orange transition-colors">
                  {t("waterDamage")}
                </a>
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
                <a href="#estimate" className="hover:text-flash-orange transition-colors">
                  Price Estimator
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-flash-orange transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#book" className="hover:text-flash-orange transition-colors">
                  Book Doorstep
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-flash-orange transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-flash-orange transition-colors">
                  Contact Us
                </a>
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
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-clean-white transition-colors cursor-pointer">
              {t("privacyPolicy")}
            </span>
            <span className="hover:text-clean-white transition-colors cursor-pointer">
              {t("termsOfService")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
