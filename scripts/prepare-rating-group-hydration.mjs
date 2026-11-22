import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDirectory = new URL('../.tmp/', import.meta.url);
const outputPath = new URL('rating-group-hydration.html', outputDirectory);
const renderer = fileURLToPath(new URL('./render-rating-group-hydration.mjs', import.meta.url));
const markup = execFileSync(process.execPath, [renderer], {
  encoding: 'utf8',
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=768' },
  maxBuffer: 1024 * 1024,
});

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, markup);
