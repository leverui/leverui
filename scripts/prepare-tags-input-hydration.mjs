import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDirectory = new URL('../.tmp/', import.meta.url);
const renderer = fileURLToPath(new URL('./render-tags-input-hydration.mjs', import.meta.url));
await mkdir(outputDirectory, { recursive: true });

for (const [name, args] of [
  ['tags-input-hydration.html', []],
  ['tags-input-guide-hydration.html', ['--guide']],
]) {
  const markup = execFileSync(process.execPath, [renderer, ...args], {
    encoding: 'utf8',
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=768' },
    maxBuffer: 1024 * 1024,
  });
  await writeFile(new URL(name, outputDirectory), markup);
}
