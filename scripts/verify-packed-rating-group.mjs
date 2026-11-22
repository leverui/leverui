import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedRatingGroup } from './packed-consumer-rating-group.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check one installed Rating Group archive in an isolated app. */
async function verifyPackedRatingGroupConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.rating-group.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=768' },
  );
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.rating-group.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/rating-group.html', verifyPackedRatingGroup);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-rating-group-'));
try {
  await verifyPackedRatingGroupConsumer(consumerDirectory);
  console.log('Packed Rating Group types, bundle, CSS override, and form behavior passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
