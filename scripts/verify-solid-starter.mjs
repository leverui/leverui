import assert from 'node:assert/strict';
import { realpath } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';
import { preview } from 'vite';

const appRoot = await realpath(
  resolve(process.argv[2] ?? fileURLToPath(new URL('../examples/solid-starter/', import.meta.url))),
);

/** Exercise the archived package through the separate Solid starter build. */
async function main() {
  const installed = await realpath(join(appRoot, 'node_modules/@leverui/components'));
  const location = relative(appRoot, installed);
  assert.ok(
    location && !location.startsWith('..') && !isAbsolute(location),
    'The starter must resolve its installed archive inside its own directory.',
  );
  const server = await preview({
    root: appRoot,
    preview: { host: '127.0.0.1', port: 0 },
  });
  let browser;
  try {
    const address = server.httpServer.address();
    assert.ok(address && typeof address !== 'string', 'Vite preview has no TCP port.');
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on(
      'pageerror',
      /** Record uncaught errors from the installed package. */
      (error) => errors.push(error.message),
    );
    await page.goto(`http://127.0.0.1:${address.port}/`);
    await expect(page.getByRole('heading', { name: 'Lever UI in Solid' })).toBeVisible();
    const input = page.getByLabel('Email address');
    await expect(input).toHaveAttribute('type', 'email');
    const helperId = await page
      .getByText('Labels and help text stay connected to the input.')
      .getAttribute('id');
    assert.ok(helperId, 'The Field helper text needs an id.');
    const describedBy = await input.getAttribute('aria-describedby');
    assert.ok(
      describedBy?.split(/\s+/).includes(helperId),
      'The input must reference its visible helper text.',
    );
    const button = page.getByRole('button', { name: 'Clicked 0 times' });
    await expect(button).toHaveAttribute('type', 'button');
    const buttonBackground = await button.evaluate(
      /** Read the scoped palette token through the Button recipe. */
      (element) => getComputedStyle(element).backgroundColor,
    );
    assert.equal(buttonBackground, 'rgb(98, 84, 199)');
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Clicked 1 times' })).toBeVisible();
    const background = await page.locator('.demo-panel').evaluate(
      /** Read the consumer CSS override after the package stylesheet. */
      (element) => getComputedStyle(element).backgroundColor,
    );
    assert.equal(background, 'rgb(247, 245, 255)');
    assert.deepEqual(errors, []);
    console.log('Solid starter: field associations, keyboard action, and CSS overrides passed.');
  } finally {
    try {
      await browser?.close();
    } finally {
      await new Promise(
        /** Close the preview listener even if Chromium cleanup fails. */
        (resolve) => server.httpServer.close(resolve),
      );
    }
  }
}

await main();
