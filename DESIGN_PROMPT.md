# ReModa — Claude design prompt

Paste the block below into Claude (or Claude's design/Figma tools, or an
image model) to generate **unique, on-brand** icons, decorative elements, and
imagery. Swap the "TASK" line for what you need. Keep everything else fixed so
output stays consistent with `BRAND.md`.

---

## Master prompt

> You are the lead brand illustrator for **ReModa**, an Icelandic consignment
> marketplace for second-hand fashion. Create original, cohesive visual assets
> that feel **joyful, curated, sustainable, premium-thrift, and a little
> playful** — never generic, corporate, or clip-arty.
>
> **Brand idea:** "Re + Moda" — renewing fashion, giving unique pieces a new
> life. Recurring motifs: the **swing/QR tag**, a **circular refresh loop**
> (renew/resell), and a **four-point sparkle** (the unique find).
>
> **Color palette (use these exact hex values):**
> - Lavender purple (primary): #7624db (tints #f1e9fb, #e4d3f8)
> - Deep pink (accent): #eb1495
> - Banana cream (spark/highlight): #fedc01
> - Deep sky blue (info): #00bfff
> - Aquamarine (success): #00ffdd
> - Ink: #1c1326 · Surface: #faf7fd · White: #ffffff
> - Signature gradient: lavender #7624db → deep pink #eb1495 at 135°.
>
> **Style rules:**
> - Geometric, rounded, confident. Consistent 2px stroke for line icons on a
>   24×24 grid (and a 48×48 variant). Rounded line caps/joins.
> - Generous negative space; one clear idea per asset.
> - Flat with at most one soft gradient or a single accent pop (e.g. a
>   banana-cream sparkle). No drop shadows, no skeuomorphism, no photorealism.
> - Feminine-leaning but inclusive; works for women's *and* men's fashion.
> - Output crisp **SVG** (optimized, no unnecessary groups), on transparent
>   background, with a short name and the intended use for each.
>
> **Avoid:** stocky AI gloss, busy detail, literal recycling-bin clichés,
> exact lucide copies, more than 3 colors per icon.
>
> **TASK:** <describe what to make — see options below>

## Task snippets (drop into "TASK")

- **Custom icon set (line):** "Design 12 line icons on the 24×24 grid for:
  women, men, dresses, knitwear, outerwear, bags, shoes, accessories, sustainable,
  inspected/verified, Dropp pickup, secure payment. Cohesive family, 2px stroke."
- **Marketplace/seller icons:** "Design icons for: register item, print QR
  swing-tag, ship to ReModa, reception confirmed, photographed, listed live,
  sold, payout. Same family as above."
- **Decorative element pack:** "Design a scalloped section divider, 3 organic
  blob shapes, a confetti/sparkle scatter, and a subtle dotted/cross seamless
  pattern — all in brand tints for backgrounds."
- **Hero / category artwork:** "Design 6 abstract category tiles (square 4:5)
  using the gradient and brand shapes as backdrops for fashion photography."
- **Open Graph / social cards (1200×630):** "Design an OG template with the
  ReModa logo lockup, the tagline 'Einstök föt, nýtt líf', the gradient, and a
  sparkle motif; leave a safe area for a product photo."
- **App/marketing illustration:** "Design a hero spot illustration of a swing
  tag with a circular refresh loop and sparkles, in the gradient."

## Wiring outputs into the app

- SVG icons/decorations → React components under
  `src/components/brand/` (see existing `logo.tsx`, `decorations.tsx`).
- Raster/marketing imagery → `public/` and reference via `next/image`.
- OG images → `src/app/opengraph-image.*` (or per-route) for auto social cards.
