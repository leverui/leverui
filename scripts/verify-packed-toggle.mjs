import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedToggle } from './packed-consumer-toggle.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Verify Toggle declarations, bundle, CSS, and button behavior from an archive. */
async function verifyPackedToggleConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.toggle.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.toggle.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/toggle.html', verifyPackedToggle);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-toggle-'));
try {
  await verifyPackedToggleConsumer(consumerDirectory);
  console.log('Packed Toggle types, bundle, CSS override, and button behavior passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
