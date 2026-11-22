import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

/** Reserve an available localhost port for one isolated preview process. */
async function availablePort() {
  const listener = createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const address = listener.address();
  assert.ok(address && typeof address !== 'string');
  await new Promise(
    /** Close the temporary port reservation. */
    (resolve, reject) =>
      listener.close(
        /** Forward a socket close failure to the caller. */ (error) =>
          error ? reject(error) : resolve(),
      ),
  );
  return address.port;
}

/** Wait for the preview to accept requests or report an early exit. */
async function waitForPreview(process, url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (process.exitCode !== null || process.signalCode !== null) {
      throw new Error('The packed consumer preview exited before becoming ready.');
    }
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // A connection refusal is expected while preview starts.
    }
    await delay(200);
  }
  throw new Error('The packed consumer preview did not become ready.');
}

/** Serve an isolated build and run a browser check with cleanup. */
export async function withPackedPreview(directory, path, verify, beforeNavigation) {
  const port = await availablePort();
  const origin = `http://127.0.0.1:${port}/`;
  const url = new URL(path, origin).href;
  const preview = spawn(
    'pnpm',
    ['exec', 'vite', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    { cwd: directory, stdio: 'inherit' },
  );
  try {
    await waitForPreview(preview, url);
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const errors = [];
      page.on(
        'pageerror',
        /** Record runtime errors with their browser stack. */ (error) =>
          errors.push(error.stack ?? error.message),
      );
      if (beforeNavigation) await beforeNavigation(page);
      await page.goto(url);
      assert.deepEqual(errors, [], 'The packed page failed before browser verification.');
      await verify(page, origin);
      assert.deepEqual(errors, []);
    } finally {
      await browser.close();
    }
  } finally {
    if (preview.exitCode === null && preview.signalCode === null) {
      preview.kill('SIGTERM');
      await once(preview, 'exit');
    }
  }
}
