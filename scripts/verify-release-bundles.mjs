import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { installConsumer, prepareConsumer, run } from './packed-consumer-setup.mjs';
import { verifyBoxTreeShaking } from './verify-box-tree-shaking.mjs';

/** Check server nodes and authored CSS survive hydration and respond to input. */
async function verifyHydration(page, warnings) {
  await page.waitForFunction(
    /** Wait for Solid's mounted owner to confirm hydration. */
    () => document.getElementById('app')?.dataset.hydrated === 'true',
  );
  const input = page.getByLabel('Release email');
  assert.equal(await input.inputValue(), 'draft');
  assert.equal(
    await input.evaluate(
      /** Check that Solid attached to the existing server input node. */
      (element) => element === window.__releaseServerInput,
    ),
    true,
  );
  const snapshot = await page.evaluate(
    /** Compare server associations and authored presentation with the hydrated DOM. */
    () => {
      const button = document.querySelector('[data-testid="release-validate"]');
      return {
        serverInputId: window.__releaseServerInputId,
        serverLabelFor: window.__releaseServerLabelFor,
        stableLabel: document.querySelector('label[for]') === window.__releaseServerLabel,
        stableButton: button === window.__releaseServerButton,
        serverStyleCount: window.__releaseServerStyleCount,
        hydratedStyleCount: document.querySelectorAll('style').length,
        serverBackground: window.__releaseServerButtonBackground,
        hydratedBackground: getComputedStyle(button).backgroundColor,
      };
    },
  );
  assert.ok(snapshot.serverInputId, 'The server input needs a stable id.');
  assert.equal(snapshot.serverLabelFor, snapshot.serverInputId);
  assert.equal(snapshot.stableLabel, true, 'Hydration replaced the server label.');
  assert.equal(snapshot.stableButton, true, 'Hydration replaced the server button.');
  assert.equal(
    snapshot.hydratedStyleCount,
    snapshot.serverStyleCount,
    'Hydration inserted a runtime style tag.',
  );
  assert.notEqual(snapshot.serverBackground, 'rgba(0, 0, 0, 0)');
  assert.equal(snapshot.hydratedBackground, snapshot.serverBackground);
  await page.getByRole('button', { name: 'Validate release field' }).click();
  await page.getByText('Release error').waitFor();
  assert.equal(await input.getAttribute('aria-invalid'), 'true');
  assert.deepEqual(warnings, []);
  console.log('Packed server markup hydrated with authored CSS and no runtime styles.');
}

/** Install the archive in isolation, build both targets, then inspect Chromium. */
async function main() {
  const directory = await mkdtemp(join(tmpdir(), 'leverui-release-bundles-'));
  try {
    await prepareConsumer(directory, {
      ignoreScripts: true,
      tools: ['vite', '@solidjs/vite-plugin'],
    });
    await installConsumer(directory);
    await verifyBoxTreeShaking(directory);
    run(
      'pnpm',
      ['exec', 'vite', 'build', '--config', 'vite.release-hydration.config.ts'],
      directory,
    );
    run('node', ['src/release-hydration-server.mjs'], directory);
    const warnings = [];

    /** Record browser warnings before the module script starts hydrating. */
    function recordWarnings(page) {
      page.on(
        'console',
        /** Keep only warning and error messages from the hydration run. */
        (message) => {
          if (['warning', 'error'].includes(message.type())) warnings.push(message.text());
        },
      );
    }

    /** Verify the hydrated page with its captured console output. */
    async function checkPage(page) {
      await verifyHydration(page, warnings);
    }

    await withPackedPreview(directory, '/release-hydration.html', checkPage, recordWarnings);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

await main();
