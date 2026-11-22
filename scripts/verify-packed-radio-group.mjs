import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedRadioGroup } from './packed-consumer-radio-group.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check one installed Radio Group archive in an isolated app. */
async function verifyPackedRadioGroupConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.radio-group.json'],
    directory,
    {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=768',
    },
  );
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.radio-group.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/radio-group.html', verifyPackedRadioGroup);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-radio-group-'));
try {
  await verifyPackedRadioGroupConsumer(consumerDirectory);
  console.log('Packed Radio Group types, bundle, CSS override, and form behavior passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
