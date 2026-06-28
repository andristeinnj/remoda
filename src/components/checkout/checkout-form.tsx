"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { formatISK } from "@/lib/money";
import { shippingFor } from "@/lib/shipping";
import { startCheckout } from "@/app/kassi/actions";
import type { DroppLocation } from "@/lib/dropp";

function getSessionId(): string {
  const KEY = "remoda.session";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function CheckoutForm({ locations }: { locations: DroppLocation[] }) {
  const router = useRouter();
  const { items, subtotalISK, clear } = useCart();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [locationId, setLocationId] = React.useState("");

  const shipping = shippingFor(subtotalISK);
  const total = subtotalISK + shipping;

  React.useEffect(() => {
    if (!pending && items.length === 0) router.replace("/karfa");
  }, [items.length, pending, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const location = locations.find((l) => l.id === locationId);
    if (!location) {
      setError("Veldu afhendingarstað.");
      return;
    }

    setPending(true);
    const result = await startCheckout({
      itemIds: items.map((i) => i.id),
      sessionId: getSessionId(),
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      droppLocationId: location.id,
      droppLocationName: `${location.name}, ${location.city}`,
    });

    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }

    if (result.mode === "dev") {
      clear();
      router.push(result.redirectUrl);
      return;
    }

    // Teya: build a hidden form and POST to the hosted payment page.
    clear();
    const form = document.createElement("form");
    form.method = "POST";
    form.action = result.checkout.actionUrl;
    for (const [name, value] of Object.entries(result.checkout.fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        {/* Contact */}
        <section>
          <h2 className="font-display text-lg font-semibold">Samskiptaupplýsingar</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Fullt nafn" name="name" required />
            <Field label="Netfang" name="email" type="email" required />
            <Field label="Símanúmer" name="phone" type="tel" />
          </div>
        </section>

        {/* Dropp pickup */}
        <section>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <MapPin className="size-5 text-lavender-purple-500" /> Afhendingarstaður
            (Dropp)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Veldu þann Dropp stað þar sem þú vilt sækja pöntunina.
          </p>
          <div className="mt-4 grid max-h-80 gap-2 overflow-y-auto pr-1">
            {locations.map((loc) => (
              <label
                key={loc.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                  locationId === loc.id
                    ? "border-primary bg-lavender-purple-50"
                    : "border-border hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  name="dropp"
                  value={loc.id}
                  checked={locationId === loc.id}
                  onChange={() => setLocationId(loc.id)}
                  className="mt-1 accent-[var(--color-primary)]"
                />
                <span>
                  <span className="font-medium text-foreground">{loc.name}</span>
                  <br />
                  <span className="text-muted-foreground">
                    {loc.address}, {loc.zip} {loc.city}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Pöntun</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 justify-between text-sm">
                <span className="line-clamp-2">{item.title}</span>
                <span className="font-medium">{formatISK(item.priceISK)}</span>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Vörur</dt>
            <dd>{formatISK(subtotalISK)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Sending</dt>
            <dd>{shipping === 0 ? "Frí" : formatISK(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>Samtals</dt>
            <dd>{formatISK(total)}</dd>
          </div>
        </dl>

        {error && (
          <p className="mt-4 rounded-lg bg-deep-pink-50 px-3 py-2 text-sm text-deep-pink-700">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Augnablik…
            </>
          ) : (
            "Greiða með Teya"
          )}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Þér verður vísað á örugga greiðslusíðu Teya.
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
