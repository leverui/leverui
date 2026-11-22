import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'multiple-triggers',
  'open-from-dialog',
  'lazy-mounted',
  'nested',
  'sizes',
  'size-matrix',
  'custom-bg',
  'form',
  'initial-focus',
  'offset',
  'placement',
  'same-width',
] as const;

/** Read a positioned Popover element's rendered width. */
function readPopoverWidth(element: Element): number {
  return element.getBoundingClientRect().width;
}

/** Require each named story to expose its initial UI. */
async function verifiesEveryPopoverExample({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-popover--${id}`);
    await expect(page.locator('#storybook-root button').first()).toBeVisible();
  }
}

/** Check default form content, focus return, and controlled dismissal. */
async function verifiesBasicAndControlled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--basic');
  const trigger = page.getByRole('button', { name: 'Click me' });
  await trigger.click();
  const panel = page.getByRole('dialog');
  await expect(panel.getByText('Lanternwright Notes')).toBeVisible();
  await expect(panel.getByPlaceholder('Your favorite character')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();

  await page.goto('/iframe.html?id=components-popover--controlled');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page.getByRole('dialog')).toContainText(
    'A signal in your code opens and closes this popover.',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
}

/** Preserve the active trigger and nested Popover state. */
async function verifiesMultipleAndNested({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--multiple-triggers');
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('dialog')).toContainText('Opened from the settings trigger.');

  await page.goto('/iframe.html?id=components-popover--nested');
  await page.getByRole('button', { name: 'Click me' }).click();
  await page.getByRole('button', { name: 'Open nested popover' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(2);
  await expect(page.getByText('This popover opens inside the first one.')).toBeVisible();
}

/** Check modal nesting and a form input's focus behavior. */
async function verifiesDialogAndForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--open-from-dialog');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Close' })).toHaveCSS(
    'position',
    'absolute',
  );
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page.getByText('Lanternwright Notes')).toBeVisible();
  await expect(page.getByText('Popover in a dialog')).toBeVisible();

  await page.goto('/iframe.html?id=components-popover--form');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page.getByPlaceholder('40px')).toBeVisible();
  await page.getByPlaceholder('Start typing...').fill('A comment');
  await expect(page.getByPlaceholder('Start typing...')).toHaveValue('A comment');
}

/** Check lazy mounting, the custom background, and initial focus. */
async function verifiesPresenceAndFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--lazy-mounted');
  await expect(page.getByText('Lanternwright Notes')).toHaveCount(0);
  const trigger = page.getByRole('button', { name: 'Click me' });
  await trigger.click();
  await expect(page.getByText('Lanternwright Notes')).toBeVisible();
  await trigger.click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText('Lanternwright Notes')).toHaveCount(0);

  await page.goto('/iframe.html?id=components-popover--custom-bg');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('background-color', 'rgb(173, 216, 230)');

  await page.goto('/iframe.html?id=components-popover--initial-focus');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page.getByRole('button', { name: 'Prev' })).toBeFocused();
  expect(
    await page.getByText('Step 2 of 4').evaluate(
      /** Keep the neutral status wrapper. */
      (element) => element.tagName,
    ),
  ).toBe('DIV');
  await expect(page.getByRole('button', { name: 'close', exact: true })).toHaveAttribute(
    'aria-label',
    'close',
  );
}

/** Verify placement, matching width, and the size matrix. */
async function verifiesPositionAndSizes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover--offset');
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByRole('dialog')).toContainText('custom offset');

  await page.goto('/iframe.html?id=components-popover--placement');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page.getByRole('dialog')).toHaveAttribute('data-side', 'bottom');
  await expect(page.getByRole('dialog')).toContainText(
    'This popover lines up with the end of its trigger.',
  );

  await page.goto('/iframe.html?id=components-popover--same-width');
  const trigger = page.getByRole('button', { name: 'Click me' });
  await trigger.click();
  const triggerWidth = await trigger.evaluate(readPopoverWidth);
  await expect
    .poll(
      /** Read the Popover panel width after the primitive positions it. */
      async () => page.getByRole('dialog').evaluate(readPopoverWidth),
    )
    .toBeCloseTo(triggerWidth, 0);

  await page.goto('/iframe.html?id=components-popover--sizes');
  await expect(page.getByRole('button', { name: 'Click me' })).toHaveCount(4);
  await page.getByRole('button', { name: 'Click me' }).first().click();
  await expect(page.getByRole('dialog')).toContainText('Lanternwright Notes');

  await page.goto('/iframe.html?id=components-popover--size-matrix');
  await expect(page.locator('#storybook-root thead td')).toHaveText(['xs', 'sm', 'md', 'lg']);
  await expect(page.getByRole('dialog')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'close', exact: true })).toHaveCount(4);
  const headerBox = await page.locator('#storybook-root thead').boundingBox();
  expect(headerBox?.height).toBe(53);
}

test('all Popover examples render', verifiesEveryPopoverExample);
test('Popover Basic and Controlled open and dismiss', verifiesBasicAndControlled);
test('Popover trigger values and nested panels work', verifiesMultipleAndNested);
test('Popover in Dialog and form work', verifiesDialogAndForm);
test('Popover presence, background, and focus work', verifiesPresenceAndFocus);
test('Popover positioning and sizes work', verifiesPositionAndSizes);
