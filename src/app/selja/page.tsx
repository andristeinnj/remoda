import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, QrCode, PackageCheck, Camera, BadgeDollarSign, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkle } from "@/components/brand/decorations";

export const metadata: Metadata = {
  title: "Seldu með ReModa",
  description:
    "Sendu okkur fötin þín og við seljum þau fyrir þig. Þú heldur 70%, við sjáum um restina.",
};

const steps = [
  { icon: ClipboardList, title: "1. Skráðu vörurnar", text: "Skráðu flíkurnar þínar á netinu og stingdu upp á verði." },
  { icon: QrCode, title: "2. Prentaðu QR-miða", text: "Við búum til einstakan QR-miða fyrir hverja flík. Festu hann á." },
  { icon: PackageCheck, title: "3. Sendu til okkar", text: "Sendu pakkann til ReModa. Við staðfestum móttöku um leið og hann berst." },
  { icon: Camera, title: "4. Myndir", text: "Við myndum flíkurnar fyrir þig — eða þú hleður upp eigin myndum." },
  { icon: BadgeDollarSign, title: "5. Við birtum", text: "Við yfirförum verð og setjum vöruna í sölu á ReModa." },
  { icon: Banknote, title: "6. Þú færð greitt", text: "Þegar varan selst færðu 70% greitt beint á reikninginn þinn." },
];

export default function SellLandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-lavender-purple-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-lavender-purple-100 px-3 py-1 text-xs font-semibold text-lavender-purple-700">
            <Sparkle className="size-3.5 text-banana-cream-500" /> Hringrásartíska
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-lavender-purple-900 md:text-5xl">
            Seldu fötin þín með ReModa
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-lavender-purple-800/80">
            Tæmdu fataskápinn og leyfðu gæðaflíkunum að lifa áfram. Þú heldur{" "}
            <strong>70%</strong> af sölunni — við sjáum um myndir, birtingu,
            greiðslur og sendingar.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/seljandi">Byrja að selja</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#hvernig">Hvernig virkar þetta?</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="hvernig" className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center font-display text-3xl font-semibold">Svona virkar þetta</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-lavender-purple-100 text-lavender-purple-600">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <div className="rounded-2xl bg-gradient-to-r from-lavender-purple-500 to-deep-pink-500 p-8 text-center text-white">
          <h2 className="font-display text-2xl font-semibold">70% til þín · 30% til ReModa</h2>
          <p className="mx-auto mt-2 max-w-md text-white/85">
            Engin skráningargjöld. Þú greiðir aðeins þegar varan selst.
          </p>
          <Button asChild size="lg" variant="accent" className="mt-6 bg-white text-lavender-purple-700 hover:bg-white/90">
            <Link href="/seljandi">Skrá fyrstu vöruna</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
