# Aarogya Multi Speciality Hospital

Single-page public hospital website built with React, TypeScript, Vite, and CSS.

## Run and validate

- From the workspace root, install dependencies with `pnpm install --frozen-lockfile`.
- Start the site with `pnpm --filter @workspace/aarogya-hospital run dev`.
- Check types with `pnpm --filter @workspace/aarogya-hospital run typecheck`.
- Build with `pnpm --filter @workspace/aarogya-hospital run build`.
- The static deployment output is `artifacts/aarogya-hospital/dist/public`.

## Hosting

The live site, https://newlifehospitaltanuku.com, is the Cloudflare Pages project `new-life-hospital`. Every push to `main` on GitHub builds and publishes it within about a minute. Its build settings, set in the Cloudflare dashboard:

- Root directory: `src-extract/Aarogya-Multi-Speciality-Hospital-main`
- Build command: `pnpm --filter ./artifacts/aarogya-hospital run build` (Cloudflare runs `pnpm install` first)
- Build output directory: `artifacts/aarogya-hospital/dist/public`
- Environment variables: `NODE_VERSION=22`, `PNPM_VERSION=10.11.1`

Cloudflare Pages serves each service page at `/<slug>` from its `<slug>.html` file and uses `404.html` for unknown paths. `www.newlifehospitaltanuku.com` is sent to the main domain by a Cloudflare redirect rule on the zone, not by anything in this repo.

The domain is set once as `siteDomain` in `src/lib/hospital.ts`; canonical links, `robots.txt`, the sitemap and structured data all follow it. `noindex` in the same file must stay `false` for the live site.

## Source files

- Shared hospital details, doctor data, FAQ content, domain, and preview indexing switch: `src/lib/hospital.ts`.
- Hero and clinic hours: `src/components/Hero.tsx`.
- Page sections: `src/components/Sections.tsx`.
- Header and shared controls: `src/components/common.tsx`.
- Footer: `src/components/Footer.tsx`.
- Page metadata and structured data: `src/lib/seo.ts` and `index.html`.
- Responsive styles and animation: `src/index.css`.
- Crawl files: `public/robots.txt` and `public/sitemap.xml`.
- Hospital photo assets: `public/assets/`.
