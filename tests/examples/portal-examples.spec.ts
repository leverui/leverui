import { expect, test, type Page } from '@playwright/test';

/** Check that the basic story moves content outside Storybook's root. */
async function verifiesPortalBasic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-portal--basic');
  await expect(page.locator('#storybook-root p')).toHaveText('Welcome');
  await expect(page.getByText('This text renders at the end of the page')).toBeVisible();
  await expect(
    page.locator('#storybook-root').getByText('This text renders at the end of the page'),
  ).toHaveCount(0);
}

/** Check that the explicit container owns its portalled content. */
async function verifiesPortalContainer({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-portal--container');
  await expect(page.getByTestId('portal-container')).toContainText(
    'This text renders inside the container',
  );
}

/** Check that the iframe heading stays in the frame while Portal uses the outer document. */
async function verifiesPortalIframe({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-portal--iframe');
  const frame = page.frameLocator('iframe[title="Portal iframe"]');
  await expect(frame.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  await expect(frame.getByText('Welcome', { exact: true })).toHaveCount(1);
  await expect(page.getByText('Welcome', { exact: true })).toHaveCount(1);
}

test('Portal Basic renders content outside its source tree', verifiesPortalBasic);
test('Portal Container uses the requested destination', verifiesPortalContainer);
test('Portal Iframe leaves the nested portal in the outer document', verifiesPortalIframe);
