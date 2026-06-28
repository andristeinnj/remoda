"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useConsent,
  saveConsent,
  onOpenConsentSettings,
} from "@/components/consent/consent-provider";

export function CookieBanner() {
  const t = useTranslations("consent");
  const consent = useConsent();
  const [forced, setForced] = React.useState(false);
  const [panel, setPanel] = React.useState(false);
  const [prefs, setPrefs] = React.useState({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  React.useEffect(
    () =>
      onOpenConsentSettings(() => {
        setPrefs({
          analytics: consent.analytics,
          marketing: consent.marketing,
          preferences: consent.preferences,
        });
        setPanel(true);
        setForced(true);
      }),
    [consent.analytics, consent.marketing, consent.preferences]
  );

  const visible = !consent.set || forced;
  if (!visible) return null;

  function close() {
    setForced(false);
    setPanel(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-start gap-3">
          <Cookie className="size-6 shrink-0 text-lavender-purple-500" />
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold">{t("title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>

            {panel && (
              <div className="mt-4 space-y-2">
                <Toggle label={t("necessary")} desc={t("necessaryDesc")} checked disabled />
                <Toggle
                  label={t("analytics")}
                  desc={t("analyticsDesc")}
                  checked={prefs.analytics}
                  onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                />
                <Toggle
                  label={t("marketing")}
                  desc={t("marketingDesc")}
                  checked={prefs.marketing}
                  onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                />
                <Toggle
                  label={t("preferences")}
                  desc={t("preferencesDesc")}
                  checked={prefs.preferences}
                  onChange={(v) => setPrefs((p) => ({ ...p, preferences: v }))}
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {panel ? (
                <Button
                  size="sm"
                  onClick={() => {
                    saveConsent(prefs);
                    close();
                  }}
                >
                  {t("save")}
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setPanel(true)}>
                  {t("customize")}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  saveConsent({ analytics: false, marketing: false, preferences: false });
                  close();
                }}
              >
                {t("rejectAll")}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  saveConsent({ analytics: true, marketing: true, preferences: true });
                  close();
                }}
              >
                {t("acceptAll")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
      <span className="text-sm">
        <span className="font-medium">{label}</span>
        <br />
        <span className="text-muted-foreground">{desc}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 size-5 shrink-0 accent-[var(--color-primary)] disabled:opacity-60"
      />
    </label>
  );
}
