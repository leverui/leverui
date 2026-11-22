import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check published ScrollArea declarations and Node rendering in isolation. */
async function verifyPackedScrollArea(directory) {
  await prepareConsumer(directory, { ignoreScripts: true, tools: ['typescript'] });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.scroll-area.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('node', ['src/scroll-area-server.mjs'], directory);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-scroll-area-'));
try {
  await verifyPackedScrollArea(consumerDirectory);
  console.log('Packed ScrollArea types and server rendering passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
