import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript } from '@solidjs/web';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const consumerCss = await readFile(
  new URL('../../demos/radio-card-consumer.css', import.meta.url),
  'utf8',
);
const markup = await readFile(
  new URL('../../.tmp/radio-card-guide-explorer-hydration.html', import.meta.url),
  'utf8',
);

/** Mark server-owned cards and the selected SVG before client attachment. */
function markServerElement(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Attach the published browser package to the Explorer server tree. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/radio-card-guide-explorer-hydration-example.tsx';
  const { hydrateRadioCardExplorer } = await import(modulePath);
  const target = document.getElementById('radio-card-guide-explorer-hydration-root');
  if (!target) throw new Error('Radio Card Explorer hydration root is missing.');
  hydrateRadioCardExplorer(target);
}

/** Keep server nodes, selected icon, styles, and native selection through hydration. */
async function verifiesExplorerHydration({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>${consumerCss}</style><div id="radio-card-guide-explorer-hydration-root">${markup}</div>`,
  );
  const root = page.getByTestId('guide-radio-card-explorer');
  const radios = root.getByRole('radio');
  const selectedIcon = root.locator('svg[data-icon="check"]');
  await expect(radios).toHaveCount(3);
  await expect(radios.first()).toBeChecked();
  await expect(selectedIcon).toHaveCount(1);
  await radios.first().evaluate(markServerElement);
  await radios.last().evaluate(markServerElement);
  await selectedIcon.evaluate(markServerElement);
  const styleCount = await page.locator('style').count();
  const errors: string[] = [];

  /** Retain page errors from hydration and later selection. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#radio-card-guide-explorer-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(radios.first()).toHaveAttribute('data-server-element', 'true');
  await expect(radios.last()).toHaveAttribute('data-server-element', 'true');
  await expect(selectedIcon).toHaveAttribute('data-server-element', 'true');
  await expect(page.locator('style')).toHaveCount(styleCount);
  await root.getByText('Vite', { exact: true }).click();
  await expect(radios.nth(1)).toBeChecked();
  await expect(selectedIcon).toHaveCount(1);
  await expect(selectedIcon).not.toHaveAttribute('data-server-element', 'true');
  expect(errors).toEqual([]);
}

test('published Radio Card Explorer hydrates its selected check', verifiesExplorerHydration);
