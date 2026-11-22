import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check installed DatePicker declarations and server behavior in isolation. */
async function verifyPackedDatePicker(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', '@internationalized/date'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.date-picker.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('node', ['src/date-picker-server.mjs'], directory);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-date-picker-'));
try {
  await verifyPackedDatePicker(consumerDirectory);
  console.log('Packed DatePicker types and server rendering passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
