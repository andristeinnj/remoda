"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CONDITIONS, GENDERS } from "@/lib/catalog";
import { registerItem } from "@/app/seljandi/actions";

export function RegisterItemForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await registerItem(new FormData(e.currentTarget));
    if (result.ok) {
      router.push(`/seljandi/vara/${result.id}/mida`);
    } else {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Titill" name="title" required full />
        <Field label="Merki" name="brand" />
        <Select label="Deild" name="gender" defaultValue="women">
          {GENDERS.map((g) => (
            <option key={g.key} value={g.key}>{g.label}</option>
          ))}
        </Select>
        <Select label="Flokkur" name="category" defaultValue="dresses">
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </Select>
        <Field label="Stærð" name="size" />
        <Field label="Litur" name="color" />
        <Select label="Ástand" name="condition" defaultValue="good">
          {CONDITIONS.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </Select>
        <Field label="Verðhugmynd (kr.)" name="proposed_price_isk" type="number" required />
      </div>

      <Textarea label="Lýsing" name="description" rows={3} />

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Myndir</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-lavender-purple-50">
            <input type="radio" name="photos_by" value="admin" defaultChecked className="mt-1 accent-[var(--color-primary)]" />
            <span>
              <span className="font-medium">ReModa myndar</span><br />
              <span className="text-muted-foreground">Við tökum myndir þegar varan berst.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-lavender-purple-50">
            <input type="radio" name="photos_by" value="seller" className="mt-1 accent-[var(--color-primary)]" />
            <span>
              <span className="font-medium">Ég hleð upp myndum</span><br />
              <span className="text-muted-foreground">Þú bætir við myndum eftir skráningu.</span>
            </span>
          </label>
        </div>
      </fieldset>

      {error && (
        <p className="rounded-lg bg-deep-pink-50 px-3 py-2 text-sm text-deep-pink-700">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Skrá og búa til QR-miða
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/seljandi")}>
          Hætta við
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  full,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}

function Select({
  label,
  children,
  ...props
}: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <select
        {...props}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </select>
    </label>
  );
}

function Textarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <textarea
        {...props}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
