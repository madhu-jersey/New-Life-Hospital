import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { copyFile, readFile } from 'node:fs/promises';
import { HOSPITAL_INFO, SEO_KEYWORDS } from './src/lib/hospital';
import { buildStructuredData } from './src/lib/seo';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT ?? '5000';
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';
const domain = HOSPITAL_INFO.siteDomain;

const escapeAttribute = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function crawlFilesPlugin() {
  const buildDate = new Date().toISOString().slice(0, 10);
  const replaceDomain = (content: string) => content
    .replaceAll('YOUR-DOMAIN', domain)
    .replaceAll('BUILD-DATE', buildDate)
    .replace('Allow: /', HOSPITAL_INFO.noindex ? 'Disallow: /' : 'Allow: /');

  return {
    name: 'hospital-crawl-files',
    transformIndexHtml(html: string) {
      const robots = HOSPITAL_INFO.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1';
      // Ship the structured data in the HTML itself; "<" is escaped so the JSON can never close the script tag.
      const jsonLd = JSON.stringify(buildStructuredData(`https://${domain}`)).replaceAll('<', '\\u003c');
      return html
        .replaceAll('%SEO_TITLE%', escapeAttribute(HOSPITAL_INFO.title))
        .replaceAll('%SEO_DESCRIPTION%', escapeAttribute(HOSPITAL_INFO.description))
        .replaceAll('%SEO_KEYWORDS%', escapeAttribute(SEO_KEYWORDS.join(', ')))
        .replaceAll('%SEO_NAME%', escapeAttribute(HOSPITAL_INFO.name))
        .replaceAll('%SEO_IMAGE%', HOSPITAL_INFO.image || HOSPITAL_INFO.logo)
        .replace('<!-- %SEO_JSONLD% -->', `<script id="hospital-jsonld" type="application/ld+json">${jsonLd}</script>`)
        .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
        .replaceAll('https://YOUR-DOMAIN/', `https://${domain}/`);
    },
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
        if (pathname !== '/robots.txt' && pathname !== '/sitemap.xml') {
          if (pathname === '/' || pathname.includes('.') || pathname.startsWith('/@') || pathname.startsWith('/src/')) return next();
          const sourceHtml = await readFile(path.resolve(import.meta.dirname, 'index.html'), 'utf8');
          const notFoundHtml = await server.transformIndexHtml(pathname, sourceHtml);
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(notFoundHtml);
          return;
        }
        try {
          const content = await readFile(path.resolve(import.meta.dirname, 'public', pathname.slice(1)), 'utf8');
          response.statusCode = 200;
          response.setHeader('Content-Type', pathname.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8');
          response.end(replaceDomain(content));
        } catch (error) {
          next(error);
        }
      });
    },
    async generateBundle(_options: import('rollup').NormalizedOutputOptions, bundle: import('rollup').OutputBundle) {
      for (const filename of ['robots.txt', 'sitemap.xml']) {
        const template = await readFile(path.resolve(import.meta.dirname, 'public', filename), 'utf8');
        this.emitFile({ type: 'asset', fileName: filename, source: replaceDomain(template) });
      }
      const indexHtml = bundle['index.html'];
      if (indexHtml?.type === 'asset') {
        bundle['404.html'] = { ...indexHtml, fileName: '404.html', name: '404.html' };
      }
    },
    async closeBundle() {
      const outputDir = path.resolve(import.meta.dirname, 'dist/public');
      await copyFile(path.join(outputDir, 'index.html'), path.join(outputDir, '404.html'));
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    crawlFilesPlugin(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
