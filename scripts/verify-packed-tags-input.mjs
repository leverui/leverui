import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedTagsInput } from './packed-consumer-tags-input.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Verify Tags Input declarations, bundle, CSS, and native form values from an archive. */
async function verifyPackedTagsInputConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.tags-input.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.tags-input.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/tags-input.html', verifyPackedTagsInput);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-tags-input-'));
try {
  await verifyPackedTagsInputConsumer(consumerDirectory);
  console.log('Packed Tags Input types, bundle, CSS override, and form value passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
