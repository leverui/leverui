import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedActionBar } from './packed-consumer-action-bar.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Verify Action Bar types, server output, CSS, and behavior from an archive. */
async function verifyPackedActionBarConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.action-bar.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('node', ['src/action-bar-server.mjs'], directory);
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.action-bar.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/action-bar.html', verifyPackedActionBar);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-action-bar-'));
try {
  await verifyPackedActionBarConsumer(consumerDirectory);
  console.log(
    'Packed Action Bar types, server, bundle, CSS override, and browser behavior passed.',
  );
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
