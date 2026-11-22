import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedSegmentGroup } from './packed-consumer-segment-group.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check one installed Segment Group archive in an isolated app. */
async function verifyPackedSegmentGroupConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.segment-group.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=768' },
  );
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.segment-group.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/segment-group.html', verifyPackedSegmentGroup);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-segment-group-'));
try {
  await verifyPackedSegmentGroupConsumer(consumerDirectory);
  console.log('Packed Segment Group types, bundle, CSS override, and form behavior passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
