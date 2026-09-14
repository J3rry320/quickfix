import * as rootParams from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ locale }) => {
  // Only read from `next/root-params` if no explicit override is provided
  if (!locale) {
    const paramValue = await (rootParams as { locale?: () => Promise<string> }).locale?.();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  // Load and merge modular translation files
  const [common, landing, repair, about, contact, services, brands] = await Promise.all([
    import(`../messages/${locale}/common.json`).then((m) => m.default),
    import(`../messages/${locale}/landing.json`).then((m) => m.default),
    import(`../messages/${locale}/repair.json`).then((m) => m.default),
    import(`../messages/${locale}/about.json`).then((m) => m.default),
    import(`../messages/${locale}/contact.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/services.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/brands.json`).then((m) => m.default).catch(() => ({})),
  ]);

  return {
    locale,
    messages: {
      ...common,
      ...landing,
      ...repair,
      ...about,
      ...contact,
      ...services,
      ...brands,
    },
  };
});
