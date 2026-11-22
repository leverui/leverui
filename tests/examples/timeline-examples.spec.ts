import { expect, test, type Page } from '@playwright/test';

/** Verify the basic milestone order, dates, and icon markers. */
async function verifiesTimelineBasic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-timeline--basic');
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByRole('listitem').first()).toContainText('Order shipped');
  await expect(page.getByRole('listitem').nth(1)).toContainText('Customs cleared');
  await expect(page.getByRole('listitem').last()).toContainText('Order delivered');
  await expect(page.locator('#storybook-root .leverui-timeline__indicator svg.lucide')).toHaveCount(
    3,
  );
  await expect(page.getByText('FedEx')).toBeVisible();
}

/** Verify alternate and date-before layouts retain their item counts. */
async function verifiesTimelineLayouts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-timeline--alternating');
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByText('Order prepared')).toBeVisible();

  await page.goto('/iframe.html?id=components-timeline--content-before');
  await expect(page.getByRole('list')).toHaveCount(3);
  await expect(page.getByRole('listitem')).toHaveCount(6);
  await expect(page.getByText('Nov 1994')).toHaveCount(3);
  await expect(page.getByText('Nov 2010')).toHaveCount(3);
}

/** Verify both matrices and the activity composition render complete content. */
async function verifiesTimelineMatricesAndComposition({ page }: { page: Page }): Promise<void> {
  for (const story of ['sizes', 'variants']) {
    await page.goto(`/iframe.html?id=components-timeline--${story}`);
    await expect(page.getByRole('list')).toHaveCount(4);
    await expect(page.getByRole('listitem')).toHaveCount(8);
    await expect(page.getByText('In progress')).toHaveCount(4);
    await expect(page.getByText('Completed')).toHaveCount(4);
  }

  await page.goto('/iframe.html?id=components-timeline--composition');
  await expect(page.getByRole('listitem')).toHaveCount(4);
  await expect(page.getByText('Theo Park')).toBeVisible();
  await expect(page.getByText('Mara Ellison')).toBeVisible();
  await expect(page.getByText('Iris')).toBeVisible();
  await expect(page.getByRole('button', { name: '👏 2' })).toBeVisible();
  await expect(page.locator('.timeline-composition-card-body')).toHaveCSS('font-size', '14px');
  await expect(page.locator('.timeline-composition-card-body')).not.toHaveAttribute('style', /.+/);
  await page.getByPlaceholder('Add comment...').fill('Looks good');
  await expect(page.getByPlaceholder('Add comment...')).toHaveValue('Looks good');
}

test('Timeline Basic preserves dated milestones', verifiesTimelineBasic);
test('Timeline layout examples preserve their event order', verifiesTimelineLayouts);
test('Timeline matrices and composition preserve content', verifiesTimelineMatricesAndComposition);
