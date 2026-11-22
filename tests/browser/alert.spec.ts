import { expect, test, type Locator, type Page } from '@playwright/test';

interface AlertColors {
  background: string;
  foreground: string;
  indicator: string;
}

/** Read the three colors that communicate an Alert's current status. */
async function readAlertColors(root: Locator): Promise<AlertColors> {
  return root.evaluate(
    /** Measure the mounted root and its indicator together. */
    (element) => {
      const indicator = element.querySelector('span');
      if (!indicator) throw new Error('Alert indicator is missing.');
      const rootStyle = getComputedStyle(element);
      return {
        background: rootStyle.backgroundColor,
        foreground: rootStyle.color,
        indicator: getComputedStyle(indicator).color,
      };
    },
  );
}

/** Verify Alert's native parts, role ownership, and recipe variants. */
async function verifiesAlertContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-alert--contract');
  const root = page.getByTestId('alert-default');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveAttribute('role', 'status');
  await expect(root).toHaveAttribute('data-status', 'info');
  await expect(root).not.toHaveAttribute('data-leverui-private-style-runtime');
  for (const part of ['indicator', 'content', 'title', 'description']) {
    await expect(page.getByTestId(`alert-default-${part}`)).not.toHaveAttribute(
      'data-leverui-private-style-runtime',
    );
  }
  await expect(root).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('alert-default-content')).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('alert-error-content')).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('alert-default-indicator').locator('svg')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(page.getByTestId('alert-error')).not.toHaveAttribute('role');
  for (const attribute of ['status', 'variant', 'size', 'inline']) {
    await expect(page.getByTestId('alert-error')).not.toHaveAttribute(attribute);
  }
  await expect(page.getByTestId('alert-error')).toHaveCSS('background-color', /rgb\(/);
  await expect(page.getByTestId('alert-responsive')).toHaveAttribute('data-size', 'sm');
  await expect(page.getByTestId('alert-responsive')).toHaveAttribute('data-size-md', 'lg');
  await expect(page.getByTestId('alert-responsive')).not.toHaveAttribute(
    'data-leverui-private-style-runtime',
  );
}

test('Alert keeps native parts and status styling', verifiesAlertContract);

/** Confirm an unstyled part stops receiving inherited Alert presentation. */
async function verifiesUnstyledIndicator({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-alert--contract');
  const root = page.getByTestId('alert-default');
  const indicator = page.getByTestId('alert-default-indicator');
  await expect(indicator).toHaveCSS('display', 'flex');
  const rootFontSize = await root.evaluate(
    /** Read the size inherited after the indicator defaults are removed. */
    (element) => getComputedStyle(element).fontSize,
  );
  await indicator.evaluate(
    /** Apply the attribute emitted by the public unstyled prop. */
    (element) => element.setAttribute('data-unstyled', ''),
  );
  await expect(indicator).toHaveCSS('display', 'block');
  await expect(indicator).toHaveCSS('font-size', rootFontSize);
}

test('Alert unstyled indicator drops default presentation', verifiesUnstyledIndicator);

/** Verify provider status changes keep the same root and update its glyph. */
async function verifiesAlertReactivity({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-alert--contract');
  const root = page.getByTestId('alert-reactive');
  const icon = page.getByTestId('alert-reactive-indicator').locator('path');
  const fixed = page.getByTestId('alert-fixed-status');
  await expect(root).toBeVisible({ timeout: 15_000 });
  const before = await icon.getAttribute('d');
  const expectedInfo = await readAlertColors(page.getByTestId('alert-default'));
  const expectedSuccess = await readAlertColors(page.getByTestId('alert-success'));
  const fixedBefore = await readAlertColors(fixed);
  expect(await readAlertColors(root)).toEqual(expectedInfo);
  expect(expectedInfo.background).not.toBe(expectedSuccess.background);
  await root.evaluate(
    /** Mark the mounted root before changing its inherited status. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('alert-toggle').click();
  await expect(root).toHaveAttribute('data-original-node', 'true');
  expect(await icon.getAttribute('d')).not.toBe(before);
  await expect(root).toHaveCSS('background-color', expectedSuccess.background);
  expect(await readAlertColors(root)).toEqual(expectedSuccess);
  expect(await readAlertColors(fixed)).toEqual(fixedBefore);
}

test('Alert updates its status icon without remounting', verifiesAlertReactivity);
