import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDirectory = new URL('../.tmp/', import.meta.url);
const renderer = fileURLToPath(new URL('./render-listbox-guide-hydration.mjs', import.meta.url));

await mkdir(outputDirectory, { recursive: true });
for (const guide of ['select-all', 'extended']) {
  const markup = execFileSync(process.execPath, [renderer, guide], {
    encoding: 'utf8',
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=768' },
    maxBuffer: 1024 * 1024,
  });
  await writeFile(new URL(`listbox-guide-${guide}-hydration.html`, outputDirectory), markup);
}
