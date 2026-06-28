import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthForm } from "@/components/auth/auth-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("loginTitle") };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">{t("loginTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("loginSubtitle")}</p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
