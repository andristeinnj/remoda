import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthForm } from "@/components/auth/auth-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("signupTitle") };
}

export default async function SignupPage() {
  const t = await getTranslations("auth");
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">{t("signupTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("signupSubtitle")}</p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
