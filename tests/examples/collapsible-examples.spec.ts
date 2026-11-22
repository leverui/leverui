import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'lazy-mounted',
  'partial-height',
  'initial-open',
  'disabled',
  'controlled',
  'store',
  'hide-mode',
] as const;

/** Require each disclosure example to render its root. */
async function verifiesEveryCollapsibleExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(180_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-collapsible--${id}`);
    await expect(page.locator('[data-collapsible-root]').first()).toBeAttached({
      timeout: 45_000,
    });
  }
}

/** Expand and collapse the introductory content. */
async function verifiesBasicDisclosure({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--basic');
  const trigger = page.getByRole('button', { name: 'Toggle collapsible' });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Lever UI', { exact: true }).first()).toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
}

/** Unmount the lazy content after closing its disclosure. */
async function verifiesLazyUnmount({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--lazy-mounted');
  const trigger = page.getByRole('button', { name: 'Toggle (unmount on exit)' });
  const content = page.getByText('If you inspect the DOM', { exact: false });
  await expect(content).toHaveCount(0);
  await trigger.click();
  await expect(content).toBeVisible();
  await trigger.click();
  await expect(content).toHaveCount(0);
}

/** Reflect controlled state and keep disabled state fixed. */
async function verifiesControlledAndDisabled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--controlled');
  await expect(page.getByText('Status: Closed')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle collapsible' }).click();
  await expect(page.getByText('Status: Open')).toBeVisible();

  await page.goto('/iframe.html?id=components-collapsible--disabled');
  const trigger = page.getByRole('button', { name: 'Toggle (disabled)' });
  await expect(trigger).toHaveAttribute('data-disabled', '');
  await trigger.click({ force: true });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
}

/** Preserve the partial preview and open-state label. */
async function verifiesPartialHeight({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--partial-height');
  const trigger = page.getByRole('button', { name: 'Show more' });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole('button', { name: 'Show less' })).toBeVisible();
  await expect(page.locator('[data-collapsible-content] p')).toHaveCount(2);
}

/** Let the external store toggle the provider-owned content. */
async function verifiesStore({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--store');
  await expect(page.getByText('State: Collapsed')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle' }).click();
  await expect(page.getByText('State: Expanded')).toBeVisible();
  await expect(page.getByText('Using the', { exact: false })).toBeVisible();
}

/** Pause the effect count while the mounted content is hidden. */
async function verifiesPausedCounter({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-collapsible--hide-mode');
  const trigger = page.getByRole('button', { name: 'Toggle content' });
  const counter = page.getByText(/Effect ticks: \d+/);
  await expect(counter).toBeVisible();
  await page.waitForTimeout(1100);
  await trigger.click();
  const pausedCount = await counter.textContent();
  await page.waitForTimeout(1200);
  await trigger.click();
  await expect(counter).toHaveText(pausedCount ?? '');
}

test('all Collapsible examples render', verifiesEveryCollapsibleExample);
test('basic Collapsible toggles its content', verifiesBasicDisclosure);
test('lazy Collapsible unmounts on exit', verifiesLazyUnmount);
test('controlled and disabled examples follow their state', verifiesControlledAndDisabled);
test('partial height expands its long content', verifiesPartialHeight);
test('external Collapsible store opens its content', verifiesStore);
test('mounted counter pauses while collapsed', verifiesPausedCounter);
