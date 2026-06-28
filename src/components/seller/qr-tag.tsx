"use client";

import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/logo";
import { formatISK } from "@/lib/money";

export function QrTag({
  token,
  tagUrl,
  title,
  brand,
  priceISK,
}: {
  token: string;
  tagUrl: string;
  title: string;
  brand: string | null;
  priceISK: number;
}) {
  return (
    <div>
      <div className="flex justify-center">
        {/* Printable swing tag */}
        <div
          id="remoda-tag"
          className="relative w-72 rounded-2xl border-2 border-lavender-purple-200 bg-white p-5 text-center"
        >
          <span className="absolute left-4 top-4 size-3 rounded-full border-2 border-lavender-purple-300" />
          <div className="flex items-center justify-center gap-1.5">
            <BrandMark className="size-6" />
            <span className="font-display text-lg font-semibold">
              Re<span className="text-accent">Moda</span>
            </span>
          </div>
          <div className="mt-4 flex justify-center">
            <QRCodeSVG value={tagUrl} size={150} level="M" />
          </div>
          <p className="mt-3 font-mono text-sm font-semibold tracking-wide">{token}</p>
          <p className="mt-2 line-clamp-1 text-sm font-medium">{title}</p>
          {brand && <p className="text-xs text-muted-foreground">{brand}</p>}
          <p className="mt-1 font-semibold">{formatISK(priceISK)}</p>
          <p className="mt-3 border-t border-dashed border-border pt-2 text-[10px] text-muted-foreground">
            Festu þennan miða á flíkina áður en þú sendir til ReModa.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center print:hidden">
        <Button onClick={() => window.print()}>
          <Printer className="size-4" /> Prenta miða
        </Button>
      </div>

      {/* Print only the tag */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #remoda-tag, #remoda-tag * { visibility: visible; }
          #remoda-tag { position: absolute; left: 50%; top: 40px; transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
