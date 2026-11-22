import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedCombobox } from './packed-consumer-combobox.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run, runTypecheck } from './packed-consumer-setup.mjs';

/** Verify the installed Combobox API, bundle, styling, and browser behavior. */
async function verifyPackedComboboxConsumer(directory) {
  await prepareConsumer(directory, { ignoreScripts: true });
  await installConsumer(directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.combobox.json'], directory);
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.combobox.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=1024',
  });
  await withPackedPreview(directory, '/combobox.html', verifyPackedCombobox);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-combobox-'));
try {
  await verifyPackedComboboxConsumer(consumerDirectory);
  console.log('Packed Combobox types, bundle, CSS override, and browser behavior passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
