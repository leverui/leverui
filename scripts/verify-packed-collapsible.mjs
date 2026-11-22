import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedCollapsible } from './packed-consumer-collapsible.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Verify Collapsible types, server output, CSS, and behavior from an archive. */
async function verifyPackedCollapsibleConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.collapsible.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('node', ['src/collapsible-server.mjs'], directory);
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.collapsible.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/collapsible.html', verifyPackedCollapsible);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-collapsible-'));
try {
  await verifyPackedCollapsibleConsumer(consumerDirectory);
  console.log(
    'Packed Collapsible types, server, bundle, CSS override, and browser behavior passed.',
  );
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
