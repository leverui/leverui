import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark server markup so accidental node replacement is observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared JSX tree from the published browser package. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/segment-group-hydration-example.tsx';
  const { hydrateSegmentGroupExample } = await import(modulePath);
  const root = document.getElementById('segment-group-hydration-root');
  if (!root) throw new Error('Segment Group hydration root was not found.');
  hydrateSegmentGroupExample(root);
}

/** Preserve both root modes, indicator nodes, and native selection. */
async function verifiesSegmentHydration({ page }: { page: Page }): Promise<void> {
  const markup = await readFile(
    new URL('../../.tmp/segment-group-hydration.html', import.meta.url),
    'utf8',
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="segment-group-hydration-root">${markup}</div>`,
  );
  const primary = page.getByRole('radiogroup', { name: 'Hydrated primary' });
  const external = page.getByRole('radiogroup', { name: 'Hydrated external' });
  const indicator = page.getByTestId('primary-indicator');
  await expect(primary.getByRole('radio', { name: 'Solid' })).toBeChecked();
  await expect(external.getByRole('radio', { name: 'React' })).toBeChecked();
  await primary.evaluate(markServerNode);
  await external.evaluate(markServerNode);
  await indicator.evaluate(markServerNode);
  const errors: string[] = [];

  /** Record client failures during published-package hydration. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#segment-group-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  expect(errors).toEqual([]);
  await expect(primary).toHaveAttribute('data-server-node', 'true');
  await expect(external).toHaveAttribute('data-server-node', 'true');
  await expect(indicator).toHaveAttribute('data-server-node', 'true');
  await primary.getByRole('radio', { name: 'React' }).check({ force: true });
  await expect(primary.getByRole('radio', { name: 'React' })).toBeChecked();
  await external.getByRole('radio', { name: 'Solid' }).check({ force: true });
  await expect(external.getByRole('radio', { name: 'Solid' })).toBeChecked();
}

test('published Segment Group survives hydration in both root modes', verifiesSegmentHydration);
