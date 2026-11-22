import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderStepsHydrationTree,
  type StepsHydrationComponents,
} from '../../.storybook/steps-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as StepsHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark one SSR tab before hydration to detect replacement. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared tree through the published browser entry. */
async function hydrateStepsInBrowser(): Promise<void> {
  const modulePath = '/.storybook/steps-hydration-example.tsx';
  const { hydrateStepsExample } = await import(modulePath);
  const target = document.getElementById('steps-hydration-root');
  if (!target) throw new Error('Steps hydration root was not found.');
  hydrateStepsExample(target);
}

/** Verify native node reuse, stable IDs, styles, and machine navigation. */
async function verifiesStepsHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same initial machine state on the server. */
    () => renderStepsHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="steps-hydration-root">${markup}</div>`,
  );
  const first = page.getByTestId('hydrated-step-trigger-0');
  const second = page.getByTestId('hydrated-step-trigger-1');
  const secondId = await second.getAttribute('id');
  if (!secondId) throw new Error('Server-rendered Steps trigger has no ID.');
  await second.evaluate(markServerNode);
  const errors: string[] = [];

  /** Capture client errors while Solid hydrates and advances the machine. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateStepsInBrowser);
  await expect(page.locator('#steps-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(second).toHaveAttribute('data-server-node', 'true');
  await expect(second).toHaveAttribute('id', secondId);
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await page.getByTestId('hydrated-step-next').click();
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Review panel')).toBeVisible();
  await expect(second).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Steps hydrates its native tabs and machine state', verifiesStepsHydration);
