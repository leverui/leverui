import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check installed DateInput declarations and server behavior in isolation. */
async function verifyPackedDateInput(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', '@internationalized/date'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.date-input.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('node', ['src/date-input-server.mjs'], directory);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-date-input-'));
try {
  await verifyPackedDateInput(consumerDirectory);
  console.log('Packed DateInput types and server rendering passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
