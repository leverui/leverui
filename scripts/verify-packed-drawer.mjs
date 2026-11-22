import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installConsumer, prepareConsumer, run, runTypecheck } from './packed-consumer-setup.mjs';

/** Check Drawer types and server markup from an isolated packed install. */
async function verifyPackedDrawer(directory) {
  await prepareConsumer(directory, { ignoreScripts: true, tools: ['typescript'] });
  await installConsumer(directory, { offline: true });
  runTypecheck(['--noEmit', '-p', 'tsconfig.drawer.json'], directory);
  run('node', ['src/drawer-server.mjs'], directory);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-drawer-'));
try {
  await verifyPackedDrawer(consumerDirectory);
  console.log('Packed Drawer public types and server rendering passed in an isolated consumer.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
