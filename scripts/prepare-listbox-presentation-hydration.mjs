import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDirectory = new URL('../.tmp/', import.meta.url);
const renderer = fileURLToPath(
  new URL('./render-listbox-presentation-hydration.mjs', import.meta.url),
);

await mkdir(outputDirectory, { recursive: true });
for (const variant of ['checkmark', 'description', 'icon']) {
  for (const selected of [false, true]) {
    const markup = execFileSync(
      process.execPath,
      [renderer, variant, ...(selected ? ['--selected'] : [])],
      {
        encoding: 'utf8',
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=768' },
        maxBuffer: 1024 * 1024,
      },
    );
    const state = selected ? '-selected' : '';
    await writeFile(
      new URL(`listbox-presentation-${variant}${state}-hydration.html`, outputDirectory),
      markup,
    );
  }
}
