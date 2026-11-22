// Prerender every public route through the built server handler into the static client output.
// Run after `vite build`: reads dist/server/prerender-routes.json, requests each route from
// dist/server/server.js, and writes dist/client/<route>/index.html. Any non-200 response, a
// non-HTML body, or an error logged while a route renders fails the build.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const clientDirectory = join(root, 'dist/client');
const serverDirectory = join(root, 'dist/server');
const origin = 'http://localhost';

const routes = JSON.parse(await readFile(join(serverDirectory, 'prerender-routes.json'), 'utf8'));
if (!Array.isArray(routes) || routes.length === 0) {
  throw new Error('The build wrote no prerender routes.');
}

const { handleRequest } = await import(pathToFileURL(join(serverDirectory, 'server.js')).href);

/** Map a route to the index.html file a static host serves for it. */
function outputFile(route) {
  return join(clientDirectory, ...route.split('/').filter(Boolean), 'index.html');
}

const loggedErrors = [];
const logError = console.error;
/** Record errors logged while a route renders, and still print them. */
console.error = (...args) => {
  loggedErrors.push(args);
  logError(...args);
};

const failures = [];
try {
  for (const route of routes) {
    loggedErrors.length = 0;
    let response;
    try {
      response = await handleRequest(new Request(new URL(route, origin)), {
        renderMode: 'async',
      });
    } catch (error) {
      failures.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    const body = await response.text();
    const contentType = response.headers.get('content-type') ?? '';
    if (response.status !== 200) {
      failures.push(`${route}: HTTP ${response.status}`);
    } else if (!contentType.startsWith('text/html')) {
      failures.push(`${route}: expected HTML, got "${contentType}"`);
    } else if (loggedErrors.length > 0) {
      failures.push(`${route}: ${loggedErrors.length} error(s) logged while rendering`);
    } else {
      const file = outputFile(route);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, body);
    }
  }
} finally {
  console.error = logError;
}

if (failures.length > 0) {
  console.error(`Prerendering failed for ${failures.length} route(s):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Prerendered ${routes.length} routes into ${clientDirectory}.`);
