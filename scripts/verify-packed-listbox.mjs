import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedListbox } from './packed-consumer-listbox.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run, runTypecheck } from './packed-consumer-setup.mjs';

/** Verify the installed Listbox API, bundle, styling, and browser behavior. */
async function verifyPackedListboxConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.listbox.json'], directory);
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.listbox.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=1024',
  });
  await withPackedPreview(directory, '/listbox.html', verifyPackedListbox);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-listbox-'));
try {
  await verifyPackedListboxConsumer(consumerDirectory);
  console.log('Packed Listbox types, bundle, CSS override, and browser behavior passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
