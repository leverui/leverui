import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyPackedSlider } from './packed-consumer-slider.mjs';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';

/** Check Slider declarations, bundle, CSS, and form behavior from an archive. */
async function verifyPackedSliderConsumer(directory) {
  await prepareConsumer(directory, {
    ignoreScripts: true,
    tools: ['typescript', 'vite', '@solidjs/vite-plugin'],
  });
  await installConsumer(directory, { offline: true });
  run(
    'node',
    ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.slider.json'],
    directory,
    { ...process.env, NODE_OPTIONS: '--max-old-space-size=1024' },
  );
  run('pnpm', ['exec', 'vite', 'build', '--config', 'vite.slider.config.ts'], directory, {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=768',
  });
  await withPackedPreview(directory, '/slider.html', verifyPackedSlider);
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-slider-'));
try {
  await verifyPackedSliderConsumer(consumerDirectory);
  console.log('Packed Slider types, bundle, CSS override, and form value passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
