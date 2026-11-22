import { expect, test, type Page } from '@playwright/test';

/** Confirm a small icon Button opens and dismisses an accessible Popover. */
async function verifiesBasicTip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=compositions-toggle-tip--basic');
  const trigger = page.getByRole('button', { name: 'Additional information' });
  const content = page.getByTestId('tip-basic-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(trigger.locator('svg')).toHaveAttribute('data-icon', 'info');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(content).toHaveAttribute('aria-label', 'Additional information');
  await expect(content).toContainText('This is some additional information.');
  await page.keyboard.press('Escape');
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
}

test('ToggleTip basic composition opens and returns focus', verifiesBasicTip);

/** Verify the information tip can render the arrow and arrow tip. */
async function verifiesArrowTip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=compositions-toggle-tip--options');
  const trigger = page.getByRole('button', { name: 'Arrow information' });
  await expect(trigger).toHaveAttribute('data-testid', 'tip-arrow-trigger');
  await trigger.click();
  const content = page.getByRole('dialog', { name: 'Arrow information' });
  await expect(content).toBeVisible();
  await expect(content.locator('[data-popover-arrow]')).toBeVisible();
  await expect(content.locator('[data-popover-arrow-tip]')).toHaveCount(1);
}

test('ToggleTip supports the arrow composition', verifiesArrowTip);

/** Keep the selected tip open on Escape while allowing outside dismissal. */
async function verifiesEscapeOption({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=compositions-toggle-tip--options');
  const trigger = page.getByRole('button', { name: 'Escape dismissal information' });
  await expect(trigger).toHaveAttribute('data-testid', 'tip-escape-trigger');
  await trigger.click();
  const content = page.getByRole('dialog', { name: 'Escape dismissal information' });
  await expect(content).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(content).toBeVisible();
  await page.getByTestId('tip-outside-target').click();
  await expect(content).toBeHidden();
}

test('ToggleTip can disable Escape dismissal', verifiesEscapeOption);

/** Keep the selected tip open on outside interaction while Escape still works. */
async function verifiesOutsideOption({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=compositions-toggle-tip--options');
  const trigger = page.getByRole('button', { name: 'Outside dismissal information' });
  await expect(trigger).toHaveAttribute('data-testid', 'tip-outside-trigger');
  await trigger.click();
  const content = page.getByRole('dialog', { name: 'Outside dismissal information' });
  await expect(content).toBeVisible();
  await page.getByTestId('tip-outside-target').click();
  await expect(content).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(content).toBeHidden();
}

test('ToggleTip can disable outside dismissal', verifiesOutsideOption);

/** Preserve the formatted file-size context and its information trigger. */
async function verifiesFileInfo({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=compositions-toggle-tip--sizes');
  const trigger = page.getByRole('button', { name: 'File size information' });
  await expect(trigger).toHaveAttribute('data-testid', 'tip-file-trigger', { timeout: 30_000 });
  await expect(page.getByText(/File size: 1\.45/)).toBeVisible();
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'File size details' })).toContainText(
    'The file size for content.tsx is 1.45kb',
  );
}

test('InfoTip composes the file-size example', verifiesFileInfo);

/** Open each size and verify the button and Popover use the matching option. */
async function verifiesTipSizes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=compositions-toggle-tip--sizes');
  const heights: number[] = [];
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    const trigger = page.getByRole('button', { name: `${size} size information` });
    const content = page.getByRole('dialog', { name: `${size} size details` });
    await expect(trigger).toBeVisible({ timeout: 30_000 });
    await expect(trigger).toHaveAttribute('data-testid', `tip-${size}-trigger`);
    const bounds = await trigger.boundingBox();
    if (!bounds) throw new Error(`The ${size} information trigger has no bounding box.`);
    heights.push(bounds.height);
    await trigger.click();
    await expect(content).toBeVisible();
    await expect(content).toContainText(`This is the "${size}" size variant`);
    await page.keyboard.press('Escape');
    await expect(content).toBeHidden();
  }
  const [xs, sm, md, lg] = heights;
  if (xs === undefined || sm === undefined || md === undefined || lg === undefined) {
    throw new Error('The four information-tip sizes were not rendered.');
  }
  expect(xs).toBeLessThan(sm);
  expect(sm).toBeLessThan(md);
  expect(md).toBeLessThan(lg);
}

test('InfoTip supports the four size compositions', verifiesTipSizes);
