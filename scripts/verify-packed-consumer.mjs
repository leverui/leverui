import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { installConsumer, prepareConsumer, run, runTypecheck } from './packed-consumer-setup.mjs';
import { runBatchedConsumerTypecheck } from './packed-consumer-bounded-typecheck.mjs';

const projectDirectory = fileURLToPath(new URL('../', import.meta.url));

/** Exercise strict types, bundling, SSR, and Chromium outside the repository. */
async function verifyPackedConsumer(directory) {
  await prepareConsumer(directory, { ignoreScripts: true });
  await installConsumer(directory);

  /** Check component examples separately; the aggregate entry is bundled and browser tested below. */
  runBatchedConsumerTypecheck(directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.alert.json'], directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.checkmark.json'], directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.empty-state.json'], directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.progress.json'], directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.progress-circle.json'], directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.radiomark.json'], directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.skeleton.json'], directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.toast.json'], directory);
  runTypecheck(['--noEmit', '-p', 'tsconfig.strict.json'], directory);
  run('pnpm', ['exec', 'vite', 'build'], directory);
  run('node', ['src/server.mjs'], directory);
  run('node', ['src/field-server.mjs'], directory);
  run('node', ['src/native-select-server.mjs'], directory);
  run('node', ['src/number-input-server.mjs'], directory);
  run('node', ['src/pin-input-server.mjs'], directory);
  run('node', ['src/textarea-server.mjs'], directory);
  run('node', ['src/fieldset-server.mjs'], directory);
  run('node', ['src/file-upload-server.mjs'], directory);
  run('node', ['src/editable-server.mjs'], directory);
  run('node', ['src/absolute-center-server.mjs'], directory);
  run('node', ['src/aspect-ratio-server.mjs'], directory);
  run('node', ['src/bleed-server.mjs'], directory);
  run('node', ['src/center-server.mjs'], directory);
  run('node', ['src/circle-server.mjs'], directory);
  run('node', ['src/square-server.mjs'], directory);
  run('node', ['src/stack-server.mjs'], directory);
  run('node', ['src/container-server.mjs'], directory);
  run('node', ['src/flex-server.mjs'], directory);
  run('node', ['src/float-server.mjs'], directory);
  run('node', ['src/grid-server.mjs'], directory);
  run('node', ['src/group-server.mjs'], directory);
  run('node', ['src/image-server.mjs'], directory);
  run('node', ['src/simple-grid-server.mjs'], directory);
  run('node', ['src/spacer-server.mjs'], directory);
  run('node', ['src/sticky-server.mjs'], directory);
  run('node', ['src/wrap-server.mjs'], directory);
  run('node', ['src/splitter-server.mjs'], directory);
  run('node', ['src/avatar-server.mjs'], directory);
  run('node', ['src/badge-server.mjs'], directory);
  run('node', ['src/alert-server.mjs'], directory);
  run('node', ['src/checkmark-server.mjs'], directory);
  run('node', ['src/empty-state-server.mjs'], directory);
  run('node', ['src/progress-server.mjs'], directory);
  run('node', ['src/progress-circle-server.mjs'], directory);
  run('node', ['src/radiomark-server.mjs'], directory);
  run('node', ['src/skeleton-server.mjs'], directory);
  run('node', ['src/toast-server.mjs'], directory);
  run('node', ['src/blockquote-server.mjs'], directory);
  run('node', ['src/card-server.mjs'], directory);
  run('node', ['src/code-server.mjs'], directory);
  run('node', ['src/code-block-server.mjs'], directory);
  run('node', ['src/color-swatch-server.mjs'], directory);
  run('node', ['src/data-list-server.mjs'], directory);
  run('node', ['src/highlight-server.mjs'], directory);
  run('node', ['src/icon-server.mjs'], directory);
  run('node', ['src/kbd-server.mjs'], directory);
  run('node', ['src/link-server.mjs'], directory);
  run('node', ['src/list-server.mjs'], directory);
  run('node', ['src/qr-code-server.mjs'], directory);
  run('node', ['src/quote-server.mjs'], directory);
  run('node', ['src/separator-server.mjs'], directory);
  run('node', ['src/span-server.mjs'], directory);
  run('node', ['src/strong-server.mjs'], directory);
  run('node', ['src/stat-server.mjs'], directory);
  run('node', ['src/status-server.mjs'], directory);
  run('node', ['src/table-server.mjs'], directory);
  run('node', ['src/tag-server.mjs'], directory);
  run('node', ['src/timeline-server.mjs'], directory);
  run('node', ['src/interaction-server.mjs'], directory);
  run('node', ['src/tabs-family-server.mjs'], directory);
  run('node', ['src/steps-family-server.mjs'], directory);
  run('node', ['src/bar-list-server.mjs'], directory);
  run('node', ['src/bar-segment-server.mjs'], directory);
  run('node', ['src/sparkline-server.mjs'], directory);
  run('node', ['src/radial-server.mjs'], directory);
  run('node', ['src/command-server.mjs'], directory);
  run('node', ['src/client-only-server.mjs'], directory);
  run('node', ['src/environment-server.mjs'], directory);
  run('node', ['src/for-server.mjs'], directory);
  run('node', ['src/locale-server.mjs'], directory);
  run('node', ['src/portal-server.mjs'], directory);
  run('node', ['src/presence-server.mjs'], directory);
  run('node', ['src/show-server.mjs'], directory);
  run('node', ['src/visually-hidden-server.mjs'], directory);
  run(
    'node',
    [join(projectDirectory, 'scripts/packed-consumer-browser.mjs'), directory],
    projectDirectory,
  );
}

const consumerDirectory = await mkdtemp(join(tmpdir(), 'leverui-packed-consumer-'));
try {
  await verifyPackedConsumer(consumerDirectory);
  console.log('Packed Solid consumer: strict types, browser bundle, SSR, and CSS passed.');
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
