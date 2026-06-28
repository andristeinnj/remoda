import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Stofna aðgang" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Stofna aðgang</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Búðu til aðgang til að fylgjast með pöntunum þínum.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
