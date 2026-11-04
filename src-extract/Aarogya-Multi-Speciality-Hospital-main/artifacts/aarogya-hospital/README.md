# Aarogya Multi Speciality Hospital

Single-page public hospital website built with React, TypeScript, Vite, and CSS.

## Run and validate

- From the workspace root, install dependencies with `pnpm install --frozen-lockfile`.
- Start the site with `pnpm --filter @workspace/aarogya-hospital run dev`.
- Check types with `pnpm --filter @workspace/aarogya-hospital run typecheck`.
- Build with `pnpm --filter @workspace/aarogya-hospital run build`.
- The static deployment output is `artifacts/aarogya-hospital/dist/public`.
- For Vercel, set the project Root Directory to `artifacts/aarogya-hospital`; `vercel.json` supplies the install, build, and output settings.
- Keep `noindex` enabled for private previews. Before launch, set `noindex` to `false` and replace `siteDomain` with the official domain in `src/lib/hospital.ts`.

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
