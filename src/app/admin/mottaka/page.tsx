import { Suspense } from "react";
import { Reception } from "@/components/admin/reception";

export default function ReceptionPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Móttaka</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Skannaðu QR-miða (eða sláðu inn miðanúmer) til að staðfesta að varan hafi borist.
      </p>
      <div className="mt-6">
        <Suspense>
          <Reception />
        </Suspense>
      </div>
    </div>
  );
}
