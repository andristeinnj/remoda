"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  if (!isSupabaseConfigured) {
    return (
      <p className="rounded-lg bg-banana-cream-100 px-4 py-3 text-sm text-banana-cream-900">
        {t("notConfigured")}
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const supabase = createSupabaseBrowserClient();

    if (mode === "signup") {
      const fullName = String(fd.get("name"));
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) setError(error.message);
      else {
        setInfo(t("signupCreated"));
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(t("loginError"));
      else {
        router.push("/minar-sidur");
        router.refresh();
      }
    }
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" && (
        <Input label={t("fullName")} name="name" type="text" autoComplete="name" required />
      )}
      <Input label={t("email")} name="email" type="email" autoComplete="email" required />
      <Input
        label={t("password")}
        name="password"
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        required
        minLength={6}
      />

      {error && (
        <p className="rounded-lg bg-deep-pink-50 px-3 py-2 text-sm text-deep-pink-700">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-lg bg-aquamarine-100 px-3 py-2 text-sm text-aquamarine-800">
          {info}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {mode === "signup" ? t("signup") : t("login")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>
            {t("haveAccount")}{" "}
            <Link href="/innskraning" className="font-medium text-primary hover:underline">
              {t("login")}
            </Link>
          </>
        ) : (
          <>
            {t("noAccount")}{" "}
            <Link href="/nyskraning" className="font-medium text-primary hover:underline">
              {t("signup")}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
