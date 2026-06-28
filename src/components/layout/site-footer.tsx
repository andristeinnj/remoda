import Link from "next/link";

const columns = [
  {
    title: "Verslun",
    links: [
      { label: "Konur", href: "/konur" },
      { label: "Karlar", href: "/karlar" },
      { label: "Nýjar vörur", href: "/leit?sort=newest" },
      { label: "Útsala", href: "/leit?sale=1" },
    ],
  },
  {
    title: "Þjónusta",
    links: [
      { label: "Sendingar (Dropp)", href: "/sendingar" },
      { label: "Skilaréttur", href: "/skil" },
      { label: "Algengar spurningar", href: "/spurningar" },
      { label: "Hafa samband", href: "/hafa-samband" },
    ],
  },
  {
    title: "Um ReModa",
    links: [
      { label: "Okkar saga", href: "/um-okkur" },
      { label: "Sjálfbærni", href: "/sjalfbaerni" },
      { label: "Skilmálar", href: "/skilmalar" },
      { label: "Persónuvernd", href: "/personuvernd" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-2xl font-semibold tracking-tight">
            Re<span className="text-accent">Moda</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Endurnýjuð tíska úr fataskápum Íslands. Einstök gæðaföt á nýju lífi.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ReModa. Öll réttindi áskilin.</p>
          <p>Greitt á öruggan hátt með Teya · Sent með Dropp</p>
        </div>
      </div>
    </footer>
  );
}
