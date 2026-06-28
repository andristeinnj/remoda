"use client";

import { useTranslations } from "next-intl";
import { openConsentSettings } from "@/components/consent/consent-provider";

export function ManageConsentButton() {
  const t = useTranslations("consent");
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="hover:text-primary transition-colors"
    >
      {t("manage")}
    </button>
  );
}
