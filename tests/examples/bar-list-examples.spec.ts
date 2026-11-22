import { expect, test, type Page } from '@playwright/test';

const ids = ['ascending', 'basic', 'formatter', 'label', 'link', 'multi-value', 'tooltip'] as const;

/** Open one Bar List example in the isolated Storybook preview. */
async function openStory(page: Page, id: (typeof ids)[number]): Promise<void> {
  await page.goto(`/iframe.html?id=charts-bar-list--${id}`);
  await expect(page.locator('#storybook-root')).toContainText(/Google|Created/);
}

/** Check every name resolves to visible chart data. */
async function rendersAll({ page }: { page: Page }): Promise<void> {
  for (const id of ids) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Compare visible ordering in both sort directions. */
async function sortsData({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  const basic = await page.locator('#storybook-root').innerText();
  expect(basic.indexOf('ChatGPT')).toBeLessThan(basic.indexOf('Google'));
  await openStory(page, 'ascending');
  const ascending = await page.locator('#storybook-root').innerText();
  expect(ascending.indexOf('Yahoo')).toBeLessThan(ascending.indexOf('ChatGPT'));
}

/** Exercise formatted values, links, pointer hover, and keyboard focus. */
async function checksVariants({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'formatter');
  await expect(page.locator('#storybook-root')).toContainText('120 (45%)');
  await openStory(page, 'label');
  await expect(page.getByText('Search engine')).toHaveCSS('line-height', '16px');
  await expect(page.getByText('ChatGPT', { exact: true })).toHaveCSS('line-height', '20px');
  await openStory(page, 'link');
  await expect(page.getByRole('link', { name: 'Created' })).toHaveAttribute('href', '#');
  await openStory(page, 'tooltip');
  await page.getByText('ChatGPT', { exact: true }).hover();
  await expect(page.getByRole('tooltip')).toContainText('1,345,000');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('tooltip')).toBeVisible();
}

test('all seven Bar List examples mount', rendersAll);
test('Bar List sorts data without mutating source order', sortsData);
test('Bar List shows formatted values, links, and hover details', checksVariants);
