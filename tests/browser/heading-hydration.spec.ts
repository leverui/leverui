import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderHeadingHydrationTree,
  type HeadingHydrationComponents,
} from '../../.storybook/heading-hydration-tree';

const serverEntry = '../../dist/server/index.js';
/** The emitted server entry must expose the source-typed Heading components used below. */
const server = (await import(serverEntry)) as HeadingHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the server's heading through the published browser entry. */
async function hydrateHeadingInBrowser(): Promise<void> {
  const modulePath = '/.storybook/heading-hydration-example.ts';
  const { hydrateHeadingExample } = await import(modulePath);
  const root = document.getElementById('heading-hydration-root');
  if (!root) throw new Error('Heading hydration root was not found.');
  hydrateHeadingExample(root);
}

/** Check native identity, responsive size, CSS overrides, and live hydration. */
async function verifiesHeadingHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render through the published server components. */
    () => renderHeadingHydrationTree(server),
  );
  expect(markup).toContain('<h2');
  expect(markup).toContain('leverui-heading');
  expect(markup).toContain('Hydrated heading');
  expect(markup).not.toMatch(/<h2[^>]*\ssize=/);
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.leverui-heading{font-weight:300}</style><div id="heading-hydration-root">${markup}</div>`,
  );
  const heading = page.locator('#hydrated-heading');
  await expect(heading).toHaveCSS('font-size', '14px');
  await expect(heading).toHaveCSS('font-weight', '300');
  await expect(heading).toHaveCSS('color', 'rgb(239, 68, 68)');
  await heading.evaluate(
    /** Mark the original server element before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture browser exceptions during hydration and provider updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateHeadingInBrowser);
  await expect(page.locator('#heading-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(heading).toHaveAttribute('data-server-node', 'true');
  await expect(heading).toHaveCSS('font-weight', '300');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(heading).toHaveCSS('font-size', '18px');
  await page.locator('#heading-hydration-toggle').click();
  await expect(heading).toHaveCSS('color', 'rgb(59, 130, 246)');
  await expect(heading).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published Heading hydrates with responsive and consumer CSS intact',
  verifiesHeadingHydration,
);
