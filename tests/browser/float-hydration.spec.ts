import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { FloatHydrationComponents } from '../../.storybook/float-hydration-tree';
import { renderFloatHydrationTree } from '../../.storybook/float-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as FloatHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Float behavior through the Storybook module. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/float-hydration-example.tsx';
  const { hydrateFloatExample } = await import(modulePath);
  const root = document.getElementById('float-hydration-root');
  if (!root) throw new Error('Float hydration root was not found.');
  hydrateFloatExample(root);
}

/** Measure Float relative to its positioned parent. */
async function placement(page: Page) {
  const parent = await page.locator('#hydrated-float-parent').boundingBox();
  const child = await page.locator('#hydrated-float').boundingBox();
  if (!parent || !child) throw new Error('Hydrated Float layout box is absent.');
  return { x: child.x - parent.x, y: child.y - parent.y };
}

/** Verify published Float hydrates and moves without node replacement. */
async function verifiesFloatHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared Float tree through published server exports. */
    () => renderFloatHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="float-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-float');
  const child = page.locator('#hydrated-float-child');
  const initial = await placement(page);
  expect(Math.abs(initial.x + 10)).toBeLessThan(1.5);
  expect(Math.abs(initial.y + 10)).toBeLessThan(1.5);
  await root.evaluate(
    /** Mark the original Float node before hydration. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the original child before hydration. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect runtime failures during attachment and live updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#float-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-float-toggle').click();
  const moved = await placement(page);
  expect(Math.abs(moved.x - 190)).toBeLessThan(1.5);
  expect(Math.abs(moved.y - 110)).toBeLessThan(1.5);
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Float hydrates and moves without replacing nodes', verifiesFloatHydration);
