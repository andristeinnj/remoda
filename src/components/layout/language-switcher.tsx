"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { setLocale } from "@/i18n/actions";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const activeLocale = useLocale() as Locale;
  const t = useTranslations("language");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function choose(locale: Locale) {
    setOpen(false);
    if (locale === activeLocale) return;
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("label")}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">{localeFlags[activeLocale]}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-background py-1 shadow-lg"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              role="menuitemradio"
              aria-checked={locale === activeLocale}
              onClick={() => choose(locale)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-muted",
                locale === activeLocale ? "font-semibold text-primary" : "text-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden>{localeFlags[locale]}</span>
                {localeNames[locale]}
              </span>
              {locale === activeLocale && <Check className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
