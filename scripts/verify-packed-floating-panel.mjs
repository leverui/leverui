import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installConsumer, prepareConsumer, run, runTypecheck } from './packed-consumer-setup.mjs';

/** Check Floating Panel types and server output from an isolated install. */
async function verifyPackedFloatingPanel(directory) {
  await prepareConsumer(directory, { ignoreScripts: true, tools: ['typescript'] });
  await installConsumer(directory, { offline: true });
  runTypecheck(['--noEmit', '-p', 'tsconfig.floating-panel.json'], directory);
  run('node', ['src/floating-panel-server.mjs'], directory);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-floating-panel-'));
try {
  await verifyPackedFloatingPanel(consumerDirectory);
  console.log('Packed Floating Panel types and server rendering passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
