"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CONDITIONS, GENDERS } from "@/lib/catalog";
import { publicImageUrl } from "@/lib/supabase/config";
import { deleteProductImage, type SaveResult } from "@/app/admin/actions";
import type { ProductWithImages } from "@/lib/supabase/types";

export function ProductForm({
  product,
  action,
}: {
  product?: ProductWithImages | null;
  action: (formData: FormData) => Promise<SaveResult>;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await action(new FormData(e.currentTarget));
    if (result.ok) {
      router.push(result.redirect);
      router.refresh();
    } else {
      setError(result.error);
      setPending(false);
    }
  }

  const measurementsText = product
    ? Object.entries(product.measurements ?? {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    : "";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Titill" name="title" defaultValue={product?.title} required full />
        <Field label="Merki" name="brand" defaultValue={product?.brand ?? ""} />
        <Select label="Deild" name="gender" defaultValue={product?.gender ?? "women"}>
          {GENDERS.map((g) => (
            <option key={g.key} value={g.key}>
              {g.label}
            </option>
          ))}
        </Select>
        <Select label="Flokkur" name="category" defaultValue={product?.category ?? "dresses"}>
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </Select>
        <Field label="Stærð" name="size" defaultValue={product?.size ?? ""} />
        <Field label="Litur" name="color" defaultValue={product?.color ?? ""} />
        <Select
          label="Ástand"
          name="condition"
          defaultValue={product?.condition ?? "good"}
        >
          {CONDITIONS.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </Select>
        <Select label="Staða" name="status" defaultValue={product?.status ?? "available"}>
          <option value="available">Til sölu</option>
          <option value="reserved">Frátekið</option>
          <option value="sold">Selt</option>
        </Select>
        <Field
          label="Verð (kr.)"
          name="price_isk"
          type="number"
          defaultValue={product?.price_isk?.toString() ?? ""}
          required
        />
        <Field
          label="Upprunalegt verð (kr.)"
          name="original_price_isk"
          type="number"
          defaultValue={product?.original_price_isk?.toString() ?? ""}
        />
      </div>

      <Textarea
        label="Lýsing"
        name="description"
        defaultValue={product?.description ?? ""}
        rows={4}
      />
      <Textarea
        label="Mál (eitt á línu, t.d. „Brjóst: 50cm“)"
        name="measurements"
        defaultValue={measurementsText}
        rows={3}
      />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="published"
          defaultChecked={product?.published ?? true}
          className="size-4 accent-[var(--color-primary)]"
        />
        Birta í verslun
      </label>

      {/* Existing images */}
      {product && product.product_images.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Myndir</p>
          <div className="flex flex-wrap gap-3">
            {product.product_images.map((img) => (
              <div
                key={img.id}
                className="relative size-24 overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={publicImageUrl(img.storage_path)}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await deleteProductImage(img.id, product.id);
                    router.refresh();
                  }}
                  className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-accent hover:bg-background"
                  aria-label="Eyða mynd"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">
          {product ? "Bæta við myndum" : "Myndir"}
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-lavender-purple-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-lavender-purple-700"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-deep-pink-50 px-3 py-2 text-sm text-deep-pink-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {product ? "Vista breytingar" : "Stofna vöru"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
          Hætta við
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  full,
  ...props
}: { label: string; full?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <input
        {...props}
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
