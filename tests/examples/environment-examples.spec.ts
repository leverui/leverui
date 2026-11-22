import { expect, test, type Page } from '@playwright/test';

/** Verify the nested portal belongs to the frame while the default portal does not. */
async function verifiesEnvironmentPortal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-environment--with-portal');
  const frame = page.frameLocator('iframe[title="Environment frame"]');
  await expect(frame.getByText('Content in the frame')).toBeVisible();
  await expect(frame.getByText('Inside iframe')).toBeVisible();
  await expect(frame.getByText('Outside iframe')).toHaveCount(0);
  await expect(page.getByText('Outside iframe')).toBeVisible();
  await expect(page.getByText('Inside iframe')).toHaveCount(0);
}

/** Verify the frame reports its own viewport instead of the outer document's. */
async function verifiesEnvironmentSize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-environment--with-size');
  const outer = page.locator('#storybook-root pre');
  const inner = page.frameLocator('iframe[title="Environment frame"]').locator('pre');
  await expect(outer).toContainText('"match":true');
  await expect(inner).toContainText('"match":false');
  const outerSize = JSON.parse(await outer.innerText()) as { w: number; h: number };
  const innerSize = JSON.parse(await inner.innerText()) as { w: number; h: number };
  expect(outerSize.w).toBeGreaterThan(600);
  expect(innerSize.w).toBeLessThanOrEqual(300);
  expect(innerSize.h).toBeGreaterThan(0);
}

/** Verify the guide's shadow-root pattern resolves the shadow environment. */
async function verifiesEnvironmentShadow({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-environment--with-shadow');
  await expect(page.getByTestId('environment-shadow-host').getByText('shadow')).toBeVisible();
}

test('Environment WithPortal keeps portals in their owning documents', verifiesEnvironmentPortal);
test('Environment WithSize reads each document window', verifiesEnvironmentSize);
test('Environment WithShadow resolves the shadow root', verifiesEnvironmentShadow);
