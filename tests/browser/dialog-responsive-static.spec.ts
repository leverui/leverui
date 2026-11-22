import { readFile } from 'node:fs/promises';
import { expect, test, type Browser } from '@playwright/test';
import { renderToString } from '@solidjs/web';
import type { DialogHydrationComponents } from '../../.storybook/dialog-hydration-tree';
import { renderDialogHydrationTree } from '../../.storybook/dialog-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as DialogHydrationComponents;
const stylesheet = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify responsive Dialog presentation from server HTML without scripts. */
async function verifiesStaticResponsiveDialog({ browser }: { browser: Browser }): Promise<void> {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 700, height: 700 },
  });
  try {
    const page = await context.newPage();
    const markup = renderToString(
      /** Keep the authored size attributes on initially visible server content. */
      () => renderDialogHydrationTree(components, true, { mdDown: 'full', md: 'lg' }),
    );
    await page.setContent(`<style>${stylesheet}</style><div>${markup}</div>`);
    const content = page.getByTestId('hydrated-dialog-content');
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('data-size-md-down', 'full');
    await expect(content).toHaveAttribute('data-size-md', 'lg');
    await expect(content).toHaveCSS('max-width', '700px');
    await page.setViewportSize({ width: 1024, height: 700 });
    await expect(content).toHaveCSS('max-width', '672px');
  } finally {
    await context.close();
  }
}

test(
  'server-rendered responsive Dialog is styled without JavaScript',
  verifiesStaticResponsiveDialog,
);
