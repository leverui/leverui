import { expect, test, type Page } from '@playwright/test';

/** Verify the default and controlled buttons toggle their pressed state. */
async function verifiesToggleBasics({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle--basic');
  const bold = page.getByRole('button', { name: 'Bold' });
  await expect(bold).toHaveAttribute('aria-pressed', 'false');
  const unpressedBackground = await bold.evaluate(
    /** Read the browser's visible button background before the state change. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await bold.click();
  await expect(bold).toHaveAttribute('aria-pressed', 'true');
  await expect(bold).not.toHaveCSS('background-color', unpressedBackground);

  await page.goto('/iframe.html?id=components-toggle--controlled');
  const controlled = page.getByRole('button', { name: 'Pressed' });
  await expect(page.getByText('Pressed: false')).toBeVisible();
  await controlled.click();
  await expect(controlled).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Pressed: true')).toBeVisible();
}

/** Verify both indicator variants change their visible content on click. */
async function verifiesToggleIndicators({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-toggle--indicator');
  const volume = page.getByRole('button', { name: 'Mute' });
  await expect(volume.locator('.lucide-volume-2')).toBeVisible();
  await volume.click();
  await expect(page.getByRole('button', { name: 'Unmute' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.lucide-volume-x')).toBeVisible();

  await page.goto('/iframe.html?id=components-toggle--pressed-icon');
  const declined = page.getByRole('button', { name: 'Declined' });
  await expect(declined).toHaveAttribute('aria-pressed', 'true');
  await expect(declined.locator('.lucide-x')).toBeVisible();
  await declined.click();
  await expect(declined).toHaveAttribute('aria-pressed', 'false');
  await expect(declined.locator('.lucide-x')).toHaveCount(0);
}

test('Toggle Basic and Controlled preserve pressed state', verifiesToggleBasics);
test('Toggle Indicator and PressedIcon preserve conditional content', verifiesToggleIndicators);
