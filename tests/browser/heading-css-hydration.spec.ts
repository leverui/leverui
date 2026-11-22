import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderHeadingCssHydrationTree,
  type HeadingCssHydrationComponents,
} from '../../.storybook/heading-css-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as HeadingCssHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry to its existing server heading. */
async function hydrateHeadingCssInBrowser(): Promise<void> {
  const modulePath = '/.storybook/heading-css-hydration-example.ts';
  const { hydrateHeadingCssExample } = await import(modulePath);
  const root = document.getElementById('heading-css-hydration-root');
  if (!root) throw new Error('Heading CSS hydration root was not found.');
  hydrateHeadingCssExample(root);
}

/** Verify a provider size update changes CSS hooks without replacing the node. */
async function verifiesHeadingCssHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use the same component tree as the browser hydration entry. */
    () => renderHeadingCssHydrationTree(server),
  );
  expect(markup).toContain('id="hydrated-css-heading"');
  expect(markup).toContain('data-size="lg"');
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="heading-css-hydration-root">${markup}</div>`,
  );
  const heading = page.locator('#hydrated-css-heading');
  await expect(heading).toHaveCSS('font-size', '18px');
  await expect(heading).toHaveAttribute('data-size-md', '2xl');
  await heading.evaluate(
    /** Tag the server node before Solid hydrates it. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const initialClass = await heading.getAttribute('class');
  const errors: string[] = [];
  /** Capture hydration exceptions instead of ignoring browser failures. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateHeadingCssInBrowser);
  await expect(page.locator('#heading-css-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(heading).toHaveCSS('font-size', '24px');
  await page.locator('#heading-css-hydration-toggle').click();
  await expect(heading).toHaveAttribute('data-size-md', '4xl');
  await expect(heading).toHaveCSS('font-size', '36px');
  await page.locator('#heading-css-hydration-toggle').click();
  await expect(heading).not.toHaveAttribute('data-size-md');
  await expect(heading).toHaveCSS('font-size', '18px');
  await expect(heading).toHaveAttribute('data-server-node', 'true');
  expect(await heading.getAttribute('class')).toBe(initialClass);
  expect(errors).toEqual([]);
}

test('published Heading hydrates finite CSS sizes in place', verifiesHeadingCssHydration);
