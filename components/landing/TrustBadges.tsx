import { useTranslations } from "next-intl";
import { Zap, ShieldCheck, Wrench, Truck } from "lucide-react";

interface TrustBadgesProps {
  className?: string;
  variant?: "light" | "surface";
}

export default function TrustBadges({
  className = "",
  variant = "light",
}: TrustBadgesProps) {
  const t = useTranslations("Hero.trustBadges");

  const badges = [
    {
      icon: Zap,
      title: t("fastService"),
      desc: t("fastServiceDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("warranty"),
      desc: t("warrantyDesc"),
    },
    {
      icon: Wrench,
      title: t("genuineParts"),
      desc: t("genuinePartsDesc"),
    },
    {
      icon: Truck,
      title: t("doorstep"),
      desc: t("doorstepDesc"),
    },
  ];

  return (
    <section
      aria-label="Service Guarantees"
      className={`py-6 sm:py-8 border-b border-border-default ${
        variant === "surface" ? "bg-clean-white" : "bg-mist-gray/80"
      } ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 p-3 sm:p-4 rounded-xl bg-clean-white border border-border-default shadow-2xs hover:border-flash-orange/40 hover:shadow-xs transition-all"
              >
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg bg-flash-orange/10 text-flash-orange">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-tech-slate leading-tight">
                    {b.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-text-muted mt-0.5 font-medium hidden sm:block">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
