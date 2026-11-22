import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedSelect } from './packed-consumer-select.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check Select types, bundle, CSS, and form behavior from an installed archive. */
async function verifyPackedSelectConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.select.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.select.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/select.html', verifyPackedSelect);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-select-'));
try {
  await verifyPackedSelectConsumer(consumerDirectory);
  console.log('Packed Select types, bundle, CSS override, and form behavior passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
