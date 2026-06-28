"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, PackageCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { receiveItemByToken, type ReceiveResult } from "@/app/admin/actions";

export function Reception() {
  const params = useSearchParams();
  const initial = params.get("tag") ?? "";
  const [token, setToken] = React.useState(initial);
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<ReceiveResult | null>(null);

  const submit = React.useCallback(async (value: string) => {
    if (!value.trim()) return;
    setPending(true);
    setResult(await receiveItemByToken(value));
    setPending(false);
  }, []);

  // Auto-confirm when arriving from a scanned QR link (mount-time side effect).
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) submit(initial);
  }, [initial, submit]);

  return (
    <div className="max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(token);
        }}
        className="flex gap-2"
      >
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="RM XXXXXXXX"
          aria-label="Miðanúmer"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 font-mono uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <PackageCheck className="size-4" />}
          Staðfesta
        </Button>
      </form>

      {result && (
        <div className="mt-6">
          {result.ok ? (
            <div className="rounded-xl border border-aquamarine-300 bg-aquamarine-100 p-4">
              <p className="flex items-center gap-2 font-medium text-aquamarine-900">
                <CheckCircle2 className="size-5" /> Móttekið: {result.title}
              </p>
              <div className="mt-3 flex gap-2">
                <Button asChild size="sm">
                  <Link href={`/admin/vorur/${result.id}`}>Mynda & samþykkja</Link>
                </Button>
              </div>
            </div>
          ) : (
            <p className="rounded-xl bg-deep-pink-50 px-4 py-3 text-sm text-deep-pink-700">
              {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
