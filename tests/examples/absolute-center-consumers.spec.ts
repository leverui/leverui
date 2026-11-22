import { expect, test, type Page } from '@playwright/test';

/** Keep the centered phone surface at the size and color. */
async function verifiesCenterExample({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-center--absolute');
  const center = page.locator('#storybook-root .absolute-center-phone');
  await expect(center).toHaveCSS('width', '48px');
  await expect(center).toHaveCSS('height', '48px');
  await expect(center).toHaveCSS('background-color', 'rgb(255, 99, 71)');
}

test('Center example keeps its absolute overlay appearance', verifiesCenterExample);

/** Keep the secondary action at the logical end of each accordion trigger. */
async function verifiesAccordionExample({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion--actions');
  const actions = page.locator('#storybook-root .absolute-center-accordion-action');
  await expect(actions.first()).toBeVisible();
  await expect(actions.first()).toHaveCSS('right', '0px');
  const parent = await actions.first().locator('xpath=..').boundingBox();
  const child = await actions.first().boundingBox();
  if (!parent || !child) throw new Error('Missing accordion action bounds.');
  expect(Math.abs(child.y + child.height / 2 - parent.y - parent.height / 2)).toBeLessThan(1.5);
}

test('Accordion actions keep their end placement', verifiesAccordionExample);

/** Keep the clear trigger inset from the tag control's inline end. */
async function verifiesTagsExample({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input--clear');
  const clear = page.locator('#storybook-root .absolute-center-tags-clear');
  await expect(clear).toBeVisible();
  await expect(clear).toHaveCSS('right', '12px');
}

test('Tags Input clear action keeps its inset', verifiesTagsExample);

/** Keep the loading surface stretched over the QR pattern. */
async function verifiesQrExample({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-qrcode--with-spinner');
  const overlay = page.locator('#storybook-root .leverui-absolute-center');
  await expect(overlay).toBeVisible();
  const parent = await overlay.locator('xpath=..').boundingBox();
  const child = await overlay.boundingBox();
  if (!parent || !child) throw new Error('Missing QR overlay bounds.');
  expect(Math.abs(parent.width - child.width)).toBeLessThan(1.5);
  expect(Math.abs(parent.height - child.height)).toBeLessThan(1.5);
}

test('QR Code spinner covers its pattern', verifiesQrExample);
