import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/logo";
import { ManageConsentButton } from "@/components/consent/manage-consent-button";

export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("footer.shop"),
      links: [
        { label: t("nav.women"), href: "/konur" },
        { label: t("nav.men"), href: "/karlar" },
        { label: t("nav.new"), href: "/leit?sort=newest" },
        { label: t("nav.sale"), href: "/leit?sale=1" },
      ],
    },
    {
      title: t("footer.service"),
      links: [
        { label: t("footer.shippingDropp"), href: "/sendingar" },
        { label: t("footer.returns"), href: "/skil" },
        { label: t("footer.faq"), href: "/spurningar" },
        { label: t("footer.contact"), href: "/hafa-samband" },
      ],
    },
    {
      title: t("footer.about"),
      links: [
        { label: t("footer.ourStory"), href: "/um-okkur" },
        { label: t("footer.sustainability"), href: "/sjalfbaerni" },
        { label: t("footer.terms"), href: "/skilmalar" },
        { label: t("footer.privacy"), href: "/personuvernd" },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>{t("footer.rights", { year })}</p>
          <div className="flex items-center gap-4">
            <ManageConsentButton />
            <p>{t("footer.payment")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
