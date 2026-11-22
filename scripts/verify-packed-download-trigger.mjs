import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check published DownloadTrigger declarations and Node rendering in isolation. */
async function verifyPackedDownloadTrigger(directory) {
  await prepareConsumer(directory, { ignoreScripts: true, tools: ['typescript'] });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.download-trigger.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('node', ['src/download-trigger-server.mjs'], directory);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-download-trigger-'));
try {
  await verifyPackedDownloadTrigger(consumerDirectory);
  console.log('Packed DownloadTrigger types and server rendering passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
