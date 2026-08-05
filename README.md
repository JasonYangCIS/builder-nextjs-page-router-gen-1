# Builder.io enrichOptions parity repro

Minimal Next.js (Pages Router) + `@builder.io/react` (Gen1 SDK) app demonstrating that Builder's
visual editor does not respect `enrichOptions` the way production rendering does. See
[`REPRO.md`](./REPRO.md) for the full writeup, evidence, and the ask for engineering.

## Setup

```bash
npm install
```

Create `.env` with:

```
NEXT_PUBLIC_BUILDER_KEY=<your Builder.io public API key>
```

## Run

```bash
npm run dev
```

Then visit `/enrich-repro`, `/product-a`, `/product-b`, `/product-c`, or `/product-d`.

## Structure

- `pages/[...page].tsx` — catch-all route; fetches from the `page` model first, falls back to
  `product`, with `enrichOptions` (`enrichLevel: 1`, `model.product.{fields,omit}`) applied.
- `components/ProductsCarousel.tsx` — real component registered via `Builder.registerComponent`,
  with a `products` list input (each item a `reference` to the `product` model).
- `lib/builder.ts` — `builder.init(...)`, imported as a side effect from `pages/_app.tsx` so it
  actually lands in the client bundle (Next.js tree-shakes anything only referenced from
  `getStaticProps`/`getStaticPaths`).
