import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import solid from '@solidjs/vite-plugin';
import { defineConfig, type Plugin } from 'vite';
import { lucideIconImports } from '../demos/lucide-icon-imports';
import { assertConceptPagesListed, conceptRoute } from './src/lib/concept-pages';
import { guideIndexPlugin } from './src/lib/guide-index-plugin';
import { llmsIndexPlugin } from './src/lib/llms-index-plugin';
import { isMarkdownPart } from './src/lib/markdown-parts';

const librarySource = resolve(import.meta.dirname, '../src/index.ts');
const guideDirectory = resolve(import.meta.dirname, '../docs/components');
const conceptDirectory = resolve(import.meta.dirname, '../docs/concepts');
const referenceDirectory = resolve(import.meta.dirname, '../docs/theme-variables');
const overviewRoutes = [
  '/docs/getting-started',
  '/docs/theme-guide',
  '/docs/colors',
  '/docs/charts',
  '/docs/accessibility',
  '/docs/server-rendering',
  '/docs/responsive-styles',
  '/docs/custom-systems',
  '/docs/tailwind',
  '/docs/ai-agents',
];
const docsDirectory = resolve(import.meta.dirname, '../docs');
const overviewSlugs = overviewRoutes.map(
  /** The overview guide's filename, such as `getting-started`. */
  (route) => route.split('/').at(-1) ?? '',
);
const conceptSlugs = readdirSync(conceptDirectory)
  .filter(
    /** Publish one route per page; numbered parts merge into their page. */
    (name) => name.endsWith('.md') && !isMarkdownPart(name),
  )
  .map(
    /** Read a concept page's slug from its filename. */
    (name) => name.slice(0, -3),
  );
assertConceptPagesListed(conceptSlugs);
const conceptRoutes = conceptSlugs.map(conceptRoute);
const guideRoutes = readdirSync(guideDirectory)
  .filter(
    /** Include public component guides in the static build; parts merge into their page. */
    (name) => name.endsWith('.md') && name !== 'README.md' && !isMarkdownPart(name),
  )
  .map(
    /** Map a guide filename to its public URL. */
    (name) => `/docs/components/${name.slice(0, -3)}`,
  );
const referenceRoutes = readdirSync(referenceDirectory)
  .filter(
    /** Publish every generated variable category as a static route. */
    (name) => name.endsWith('.md'),
  )
  .map(
    /** Map the theme index and category files to their public URLs. */
    (name) =>
      name === 'README.md' ? '/docs/theme-variables' : `/docs/theme-variables/${name.slice(0, -3)}`,
  );

/** Every page the static build writes. */
const prerenderRoutes: readonly string[] = [
  '/',
  '/docs',
  '/playground',
  '/guides',
  ...overviewRoutes,
  ...conceptRoutes,
  ...guideRoutes,
  ...referenceRoutes,
];

/** Write the route list beside the server bundle for `scripts/prerender.mjs`. */
function prerenderRouteList(): Plugin {
  return {
    name: 'leverui-prerender-routes',
    apply: 'build',
    applyToEnvironment:
      /** Emit the list with the server bundle only. */
      (environment) => environment.name === 'ssr',
    /** Add the route list to the server output. */
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'prerender-routes.json',
        source: JSON.stringify(prerenderRoutes),
      });
    },
  };
}

/**
 * On the dev server, answer an address the site has no page for with the 404 page and a 404
 * status, as the host does in production. Files, Vite's own requests, and known pages pass.
 */
function devNotFoundPage(): Plugin {
  const knownPages = new Set(prerenderRoutes);
  const notFoundPage = resolve(import.meta.dirname, 'public/404.html');
  return {
    name: 'leverui-dev-not-found',
    apply: 'serve',
    /** Add the check ahead of the app's own page rendering. */
    configureServer(server) {
      server.middlewares.use(
        /** Serve the 404 page for a page address the site does not have. */
        (request, response, next) => {
          const path = (request.url ?? '/').split('?')[0]?.replace(/(?!^)\/+$/, '') ?? '/';
          const wantsPage =
            request.method === 'GET' && (request.headers.accept ?? '').includes('text/html');
          const isFile = path.includes('.') || path.startsWith('/@') || path.startsWith('/__');
          if (!wantsPage || isFile || knownPages.has(path)) {
            next();
            return;
          }
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(readFileSync(notFoundPage, 'utf8'));
        },
      );
    },
  };
}

export default defineConfig({
  plugins: [
    devNotFoundPage(),
    lucideIconImports(),
    solid({ start: { document: './src/document.tsx' }, ssr: true }),
    prerenderRouteList(),
    guideIndexPlugin(docsDirectory, overviewSlugs),
    llmsIndexPlugin(docsDirectory, overviewSlugs),
  ],
  resolve: {
    /*
     * The examples import the library from its source. The site's own imports resolve there too,
     * so each page loads one copy of the library, not the source and the built package side by side.
     */
    alias: [{ find: /^@leverui\/components$/, replacement: librarySource }],
  },
  server: {
    watch: { ignored: ['**/dist/**'] },
  },
});
