import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo, BrandMark, Wordmark } from "@/components/brand/logo";
import {
  Sparkle,
  ScallopDivider,
  Blob,
  SwingTag,
} from "@/components/brand/decorations";

export const metadata: Metadata = {
  title: "Stílbók",
  robots: { index: false },
};

const families = [
  { name: "lavender-purple", role: "Primary / brand" },
  { name: "deep-pink", role: "Accent / sale" },
  { name: "banana-cream", role: "Highlight / spark" },
  { name: "deep-sky-blue", role: "Info" },
  { name: "aquamarine", role: "Success" },
];
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10">
      <h2 className="mb-5 font-display text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        ReModa
      </p>
      <h1 className="font-display text-4xl font-semibold">Stílbók — Design system</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Living reference for the ReModa brand. See <code>BRAND.md</code> for the
        full guide.
      </p>

      <Section title="Logo">
        <div className="flex flex-wrap items-center gap-10 rounded-2xl border border-border p-8">
          <Logo />
          <BrandMark className="size-12" />
          <Wordmark />
          <div className="rounded-xl bg-lavender-purple-950 p-4">
            <Logo wordmarkClassName="text-white" />
          </div>
        </div>
      </Section>

      <Section title="Color">
        <div className="space-y-4">
          {families.map((f) => (
            <div key={f.name}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-semibold">{f.name}</span>
                <span className="text-muted-foreground">{f.role}</span>
              </div>
              <div className="grid grid-cols-11 overflow-hidden rounded-lg">
                {shades.map((s) => (
                  <div
                    key={s}
                    className="h-12"
                    style={{ backgroundColor: `var(--color-${f.name}-${s})` }}
                    title={`${f.name}-${s}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 h-16 rounded-xl bg-gradient-to-r from-lavender-purple-500 to-deep-pink-500" />
      </Section>

      <Section title="Typography">
        <div className="space-y-3 rounded-2xl border border-border p-8">
          <p className="font-display text-5xl font-semibold">Fraunces display</p>
          <p className="font-display text-2xl">Headings, editorial moments</p>
          <p className="text-base">Geist Sans — body & UI text for everyday reading.</p>
          <p className="font-mono text-sm text-muted-foreground">
            Geist Mono — RM-1001 · QR tag IDs
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge variant="brand">Brand</Badge>
          <Badge variant="sale">-40%</Badge>
          <Badge variant="success">New with tags</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="sold">Sold</Badge>
        </div>
      </Section>

      <Section title="Decorative elements">
        <div className="flex flex-wrap items-center gap-10 rounded-2xl border border-border p-8">
          <Sparkle className="size-8 text-banana-cream-500" />
          <SwingTag className="size-10 text-lavender-purple-500" />
          <div className="relative size-24 text-lavender-purple-100">
            <Blob className="size-24" />
          </div>
          <div className="w-40 text-deep-pink-200">
            <ScallopDivider />
          </div>
        </div>
      </Section>
    </div>
  );
}
