import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderBadgeHydrationTree,
  type BadgeHydrationComponents,
} from '../../.storybook/badge-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as BadgeHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Badge tree to its existing server markup. */
async function hydrateBadgeInBrowser(): Promise<void> {
  const modulePath = '/.storybook/badge-hydration-example.tsx';
  const { hydrateBadgeExample } = await import(modulePath);
  const root = document.getElementById('badge-hydration-root');
  if (!root) throw new Error('Badge hydration root was not found.');
  hydrateBadgeExample(root);
}

/** Verify Badge node identity, styling, and provider updates through hydration. */
async function verifiesBadgeHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render from the published server entry before attaching browser behavior. */
    () => renderBadgeHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="badge-hydration-root">${markup}</div>`,
  );
  const badge = page.locator('#hydrated-badge');
  await expect(badge).toHaveAttribute('data-size', 'xs');
  await expect(badge).toHaveAttribute('data-leverui-color-palette', 'blue');
  await expect(badge).not.toHaveAttribute('data-leverui-private-style-runtime');
  await expect(badge).toHaveCSS('min-height', '16px');
  await expect(badge).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await badge.evaluate(
    /** Mark the original server node before attaching Solid. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record any error raised during hydration or the later state change. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateBadgeInBrowser);
  await expect(page.locator('#badge-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(badge).toHaveAttribute('data-server-node', 'true');
  await expect(badge).toHaveCSS('min-height', '16px');
  await page.locator('#badge-hydration-toggle').click();
  await expect(badge).toHaveAttribute('data-size', 'lg');
  await expect(badge).not.toHaveAttribute('data-leverui-private-style-runtime');
  await expect(badge).toHaveCSS('min-height', '28px');
  await expect(badge).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  expect(errors).toEqual([]);
}

test('published Badge hydrates without replacing its native span', verifiesBadgeHydration);
