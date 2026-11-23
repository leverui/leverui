import { expect, test, type Page } from '@playwright/test';
import { expectCustomPropertyLength } from './css-length';

const ids = ['basic', 'reference', 'legend', 'bar-size', 'tooltip'] as const;

/** Open a Bar Segment example in the Storybook preview. */
async function openStory(page: Page, id: (typeof ids)[number]): Promise<void> {
  await page.goto(`/iframe.html?id=charts-bar-segment--${id}`);
  await expect(page.locator('#storybook-root')).toContainText(
    id === 'bar-size' ? 'Ruby' : 'Google',
  );
}

/** Check every named segment story displays its own collection. */
async function rendersAll({ page }: { page: Page }): Promise<void> {
  for (const id of ids) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check the reference marker and smaller chart token. */
async function checksMarkerAndSize({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'reference');
  await expect(page.getByText('Target')).toBeVisible();
  await openStory(page, 'bar-size');
  await expectCustomPropertyLength(
    page.locator('#storybook-root [style*="--lui-bar-segment-size:"]').first(),
    '--lui-bar-segment-size',
    '0.75rem',
  );
  await expect(page.locator('#storybook-root')).toContainText('35%');
  await expect(page.getByText('Ruby', { exact: true })).toHaveCSS('font-size', '12px');
  await expect(page.getByText('Ruby', { exact: true })).toHaveCSS('line-height', '16px');
  await openStory(page, 'reference');
  await expect(page.getByText('Target')).toHaveCSS('top', '-4px');
}

/** Move focus through neighboring segments and read the active tooltip. */
async function checksKeyboardTooltip({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'tooltip');
  await page.locator('[aria-label="Google: 500000"]').focus();
  await expect(page.getByRole('tooltip')).toContainText('500,000');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('tooltip')).toContainText('Bing');
}

test('all five Bar Segment examples mount', rendersAll);
test('Bar Segment and bar size match their data', checksMarkerAndSize);
test('Bar Segment tooltip is available by keyboard', checksKeyboardTooltip);
