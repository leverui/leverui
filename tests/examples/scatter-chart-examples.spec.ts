import { expect, test, type Page } from '@playwright/test';

/** Open a public Scatter Chart story in its rendered iframe. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=charts-scatter-chart--${id}`);
  await expect(page.locator('#storybook-root svg[role="img"]')).toBeVisible();
}

/** Verify all five examples draw their intended points and overlays. */
async function checksVariants({ page }: { page: Page }): Promise<void> {
  for (const id of ['basic', 'legend', 'multiple', 'connect-dots', 'trend-line']) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-scatter-point]').first()).toBeVisible();
  }
  await openStory(page, 'basic');
  await expect(page.locator('#storybook-root [data-scatter-point]')).toHaveCount(12);
  await expect(page.locator('#storybook-root [data-scatter-axes]')).toContainText('28.1°C');
  const plot = page.locator('#storybook-root [data-scatter-axes]');
  await expect(plot.locator('line').first()).toHaveAttribute('x1', '65');
  await expect(plot.locator('line').first()).toHaveAttribute('x2', '1162');
  await expect(plot.locator('text').first()).toHaveCSS('font-size', '12px');
  await expect(page.locator('#storybook-root [data-scatter-point]').first()).toHaveAttribute(
    'r',
    '4.5',
  );
  await openStory(page, 'multiple');
  await expect(page.locator('[data-scatter-axes] line').first()).toHaveAttribute('x1', '60');
  await expect(page.locator('[data-scatter-axes] line').first()).toHaveAttribute('x2', '1138');
  await expect(page.locator('#storybook-root [data-scatter-series]')).toHaveCount(2);
  await expect(page.locator('#storybook-root [data-scatter-point]')).toHaveCount(12);
  await openStory(page, 'connect-dots');
  await expect(page.locator('#storybook-root [data-scatter-series] path')).toHaveCount(1);
  await openStory(page, 'trend-line');
  await expect(page.locator('#storybook-root [data-scatter-trend]')).toHaveCount(1);
  await openStory(page, 'legend');
  await expect(page.locator('#storybook-root')).toContainText('Group 1');
}

/** Let keyboard users inspect and dismiss each grouped point. */
async function checksTooltip({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'multiple');
  await page.locator('#storybook-root [role="group"]').focus();
  await expect(page.getByRole('tooltip')).toContainText('Group 1100Group 1200');
  await expect(page.locator('[data-scatter-cursor] line')).toHaveCount(2);
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tooltip')).toContainText('Group 1120Group 1100');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.locator('#storybook-root [data-scatter-series="Group 2"] circle').first().hover();
  await expect(page.getByRole('tooltip')).toContainText('Group 2200Group 2260');
}

test('Scatter Chart stories draw all five variants', checksVariants);
test('Scatter Chart tooltip supports pointer and keyboard inspection', checksTooltip);
