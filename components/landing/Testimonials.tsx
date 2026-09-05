import { useTranslations } from "next-intl";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const t = useTranslations("Testimonials");

  const reviews = [
    {
      name: t("t1Name"),
      role: t("t1Role"),
      area: t("t1Area"),
      text: t("t1Text"),
      initials: "AK",
      stars: 5,
    },
    {
      name: t("t2Name"),
      role: t("t2Role"),
      area: t("t2Area"),
      text: t("t2Text"),
      initials: "PD",
      stars: 5,
    },
    {
      name: t("t3Name"),
      role: t("t3Role"),
      area: t("t3Area"),
      text: t("t3Text"),
      initials: "RB",
      stars: 5,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-clean-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Star Rating Pill */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-mist-gray border border-zinc-200 px-4 py-1.5 mb-3 shadow-2xs">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-tech-slate">
              {t("rating")}
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-tech-slate tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-500 font-medium">
            {t("reviewsCount")}
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl bg-mist-gray border border-zinc-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-flash-orange/40 transition-all"
            >
              <div>
                <Quote className="h-8 w-8 text-flash-orange/30 mb-3" />
                <p className="text-sm sm:text-base text-zinc-700 font-body leading-relaxed mb-6">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tech-slate text-clean-white font-heading font-extrabold text-xs shrink-0 shadow-2xs">
                  {rev.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading text-sm font-bold text-tech-slate">
                      {rev.name}
                    </h4>
                    <CheckCircle2 className="h-3.5 w-3.5 text-flash-orange" />
                  </div>
                  <p className="text-xs text-zinc-500 font-medium leading-tight">
                    {rev.role} • {rev.area}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
