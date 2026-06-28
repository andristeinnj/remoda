# ReModa — Brand & Design System

## 1. Brand essence

**ReModa** = _Re_ (renew, again) + _Moda_ (fashion). An Icelandic consignment
marketplace giving quality second-hand clothing a second life.

- **Mission:** Make circular fashion the easy, joyful default in Iceland.
- **Promise:** Every piece is unique, inspected, and one tap from a new home.
- **Personality:** Joyful · Curated · Sustainable · A little playful · Premium-thrift.
- **Tagline:** _Einstök föt, nýtt líf_ — "Unique pieces, new life."

### Voice & tone
Warm, clear, confident, never preachy about sustainability — we _show_ it.
Short sentences. Friendly Icelandic first, with English, Spanish and Polish for
Iceland's communities. Avoid jargon; celebrate the find.

## 2. Logo

- **Mark:** a rounded *renewal tag* — a tag tile in the brand gradient with a
  circular refresh loop and a banana-cream spark. The tag nods to the QR
  swing-tags used in consignment intake. Component: `src/components/brand/logo.tsx`
  → `BrandMark`.
- **Wordmark:** `ReModa` in Fraunces, with `Moda` in deep-pink. → `Wordmark`.
- **Lockup:** `Logo` (mark + wordmark).
- **Clear space:** keep at least the height of the mark's corner radius around it.
- **Don'ts:** don't recolor the mark outside the gradient, don't stretch, don't
  place the gradient mark on busy photos without a chip/scrim.

## 3. Color

Tokens live in `src/app/globals.css` (`@theme`). Five families, semantic roles:

| Role | Token | Hex |
| --- | --- | --- |
| **Primary / brand** | `lavender-purple-500` | `#7624db` |
| **Accent / sale** | `deep-pink-500` | `#eb1495` |
| **Highlight / spark** | `banana-cream-500` | `#fedc01` |
| **Info** | `deep-sky-blue-500` | `#00bfff` |
| **Success** | `aquamarine-500` | `#00ffdd` |
| Background | `--color-background` | `#ffffff` |
| Surface | `--color-surface` | `#faf7fd` |
| Foreground | `--color-foreground` | `#1c1326` |

Each family ships 50–950. **Brand gradient:** `lavender-purple-500 → deep-pink-500`
(135°). Use vivid 400–600 for accents; 50–100 for tints/backgrounds; 800–950 for text.

### Accessibility
Body text uses `foreground` on `background` (AA+). On gradient/photo, use white
text with a scrim. Never rely on color alone — pair sale % with the "Sale" badge.

## 4. Typography

- **Display / headings:** Fraunces (serif) — characterful, editorial.
- **Body / UI:** Geist Sans.
- **Mono:** Geist Mono (codes, order numbers, QR tag IDs).
- Headings `tracking-tight`; consider `text-wrap: balance` on big headings.
- Numerals in tables use `tabular-nums`.

## 5. Iconography

- Base set: **lucide-react** at `1.5–2px` stroke, `size-4/5`, `rounded` joins.
- **Brand icons** (custom, for ReModa-specific concepts) in
  `src/components/brand/decorations.tsx`: `SwingTag` (intake/QR), `Sparkle`
  (unique find). Keep custom icons on the same 24/48 grid and stroke weight.

## 6. Decorative elements

`src/components/brand/decorations.tsx`:
- **Sparkle** — accent on "unique"/"new with tags" moments.
- **ScallopDivider** — soft boutique section edges.
- **Blob** — playful low-opacity background accent (use a brand tint).
- **SwingTag** — recurring motif; basis for printed QR consignment tags.

Use sparingly — one decorative gesture per view. Let product photos lead.

## 7. UI components & tokens

- **Radius:** pills for actions (`rounded-full`), `rounded-xl/2xl` for cards.
- **Buttons:** `src/components/ui/button.tsx` — variants `primary` (lavender),
  `accent` (pink), `outline`, `ghost`, `link`.
- **Badges:** `src/components/ui/badge.tsx` — `brand`, `sale`, `success`, `info`, `sold`.
- **Focus:** always visible — `focus-visible:ring-2 ring-ring ring-offset-2`.
- **Motion:** animate `transform`/`opacity` only; respect `prefers-reduced-motion`.

A living reference renders at **`/stilbok`** (style guide).

## 8. Photography

Bright, natural light; clean or soft-tint backgrounds; full-garment + detail +
on-body where possible. Square (4:5) product crops. Real, lived-in, optimistic —
not sterile studio. Consignment sellers get a shot-list in their dashboard.

## 9. Imagery / illustration

Generate brand imagery and icons with the prompt in `DESIGN_PROMPT.md` so new
assets stay consistent with this system.
