"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveAndList, rejectItem } from "@/app/admin/actions";
import { formatISK } from "@/lib/money";

const INTAKE_LABEL: Record<string, string> = {
  awaiting_reception: "Bíður móttöku",
  received: "Móttekið",
  listed: "Í sölu",
  rejected: "Hafnað",
};

export function IntakePanel({
  productId,
  intakeStatus,
  proposedPrice,
}: {
  productId: string;
  intakeStatus: string;
  proposedPrice: number | null;
}) {
  const router = useRouter();
  const [price, setPrice] = React.useState(String(proposedPrice ?? ""));
  const [pending, setPending] = React.useState(false);

  async function approve() {
    setPending(true);
    await approveAndList(productId, Number(price));
    router.refresh();
    setPending(false);
  }
  async function reject() {
    const reason = prompt("Ástæða höfnunar?") ?? "";
    if (!reason) return;
    setPending(true);
    await rejectItem(productId, reason);
    router.refresh();
    setPending(false);
  }

  return (
    <div className="rounded-xl border border-lavender-purple-200 bg-lavender-purple-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Sölumeðferð (consignment)</h3>
        <Badge variant="info">{INTAKE_LABEL[intakeStatus] ?? intakeStatus}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Verðhugmynd seljanda:{" "}
        <span className="font-semibold text-foreground">
          {proposedPrice ? formatISK(proposedPrice) : "—"}
        </span>
      </p>

      {intakeStatus !== "listed" && (
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Samþykkt verð (kr.)</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-40 rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <Button type="button" onClick={approve} disabled={pending || !price}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Samþykkja og birta
          </Button>
          <Button type="button" variant="outline" onClick={reject} disabled={pending}>
            <X className="size-4" /> Hafna
          </Button>
        </div>
      )}
    </div>
  );
}
