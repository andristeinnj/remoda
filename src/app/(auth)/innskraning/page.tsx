import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Innskráning" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Skrá inn</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Skráðu þig inn til að sjá pantanir þínar.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
