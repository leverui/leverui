import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'lazy-mounted',
  'nested',
  'size-matrix',
  'variant-matrix',
  'variants',
  'with-animation',
  'custom-indicator',
  'disabled-tab',
  'dynamic-add',
  'fitted',
  'indicator',
  'links',
  'manual-activation',
  'responsive-orientation',
  'store',
  'vertical',
] as const;

/** Confirm every story renders a visible tab trigger. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-tabs--${id}`);
    await expect(page.getByRole('tab').first()).toBeVisible();
  }
}

/** Check selection, controlled state, link targets, and external state. */
async function verifiesSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs--basic');
  await page.getByRole('tab', { name: 'Projects' }).click();
  await expect(page.locator('[role="tabpanel"][data-state="open"]')).toContainText(
    'See each project and who is working on it.',
  );

  await page.goto('/iframe.html?id=components-tabs--controlled');
  await page.getByRole('tab', { name: 'Second tab' }).click();
  await expect(page.locator('[role="tabpanel"][data-state="open"]')).toHaveText('Second panel');

  await page.goto('/iframe.html?id=components-tabs--links');
  await expect(page.getByRole('tab', { name: 'Members' })).toHaveAttribute('href', '#members');
  await page.getByRole('tab', { name: 'Projects' }).click();
  await expect(page.locator('[role="tabpanel"][data-state="open"]')).toHaveText(
    'See each project and who is working on it.',
  );

  await page.goto('/iframe.html?id=components-tabs--store');
  await page.getByRole('tab', { name: 'Projects' }).click();
  await expect(page.getByText('selected: projects')).toBeVisible();
}

/** Ensure lazy panels unmount and nested panels keep separate state. */
async function verifiesLifecycle({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs--lazy-mounted');
  await expect(page.getByRole('tabpanel')).toContainText('Tab 1: Content');
  await page.getByRole('tab', { name: 'Tab 2' }).click();
  await expect(page.locator('[role="tabpanel"][data-state="open"]')).toContainText(
    'Tab 2: Content',
  );
  await expect(page.getByText('Tab 1: Content')).toHaveCount(0);

  await page.goto('/iframe.html?id=components-tabs--nested');
  await page.getByRole('tab', { name: 'Tab 1.2' }).click();
  await expect(page.getByRole('textbox', { name: 'Tab 1.2' })).toBeVisible();
  await page.getByRole('tab', { name: 'Tab 2', exact: true }).click();
  await expect(page.getByText('This is a normal tab')).toBeVisible();
}

/** Verify dynamic additions and removal preserve working tab controls. */
async function verifiesDynamicTabs({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs--dynamic-add');
  await expect(page.getByRole('tab')).toHaveCount(4);
  await page.getByRole('button', { name: 'Add tab' }).click();
  await expect(page.getByRole('tab')).toHaveCount(5);
  await expect(page.getByRole('tab').last()).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[role="tabpanel"][data-state="open"]')).toContainText('Tab body');
  const close = page.locator('[role="tab"] [role="button"]').last();
  await expect(close).toHaveJSProperty('tagName', 'SPAN');
  await close.click();
  await expect(page.getByRole('tab')).toHaveCount(4);
  await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(0);
}

/** Check the full matrices and responsive orientation. */
async function verifiesVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs--size-matrix');
  await expect(page.getByRole('tab', { name: 'Settings' })).toHaveCount(15);
  const sizeHeader = page.locator('#storybook-root thead');
  await expect(sizeHeader).toHaveCSS('font-size', '14px');
  await expect(sizeHeader).toHaveCSS('color', 'rgb(82, 82, 91)');

  await page.goto('/iframe.html?id=components-tabs--variant-matrix');
  await expect(page.getByRole('tab', { name: 'Settings' })).toHaveCount(50);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/iframe.html?id=components-tabs--responsive-orientation');
  await expect(page.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(page.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
}

/** Check disabled, manual, fitted, animated, and vertical structures. */
async function verifiesStructures({ page }: { page: Page }): Promise<void> {
  for (const id of ['disabled-tab', 'manual-activation']) {
    await page.goto(`/iframe.html?id=components-tabs--${id}`);
    await expect(page.getByRole('tab', { name: 'Projects' })).toBeDisabled();
  }
  await page.goto('/iframe.html?id=components-tabs--fitted');
  await expect(page.getByRole('tab')).toHaveCount(3);
  await page.goto('/iframe.html?id=components-tabs--indicator');
  await expect(page.locator('[data-tabs-indicator]')).toBeVisible();
  await page.goto('/iframe.html?id=components-tabs--custom-indicator');
  await expect(page.locator('[data-tabs-indicator]')).toBeVisible();
  await page.goto('/iframe.html?id=components-tabs--with-animation');
  await page.getByRole('tab', { name: 'Tab 2' }).click();
  const animatedPanel = page.locator('[role="tabpanel"][data-state="open"]');
  await expect(animatedPanel).toContainText('The second panel');
  await expect(animatedPanel).toHaveCSS('animation-name', 'fade-in, scale-in');
  await expect(animatedPanel).toHaveCSS('animation-duration', '0.3s');
  await page.goto('/iframe.html?id=components-tabs--vertical');
  await expect(page.getByRole('tablist')).toHaveCount(4);
}

/** Keep manual activation and the moving indicator aligned. */
async function verifiesActiveStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs--manual-activation');
  const members = page.getByRole('tab', { name: 'Members' });
  const settings = page.getByRole('tab', { name: 'Settings' });
  await members.click();
  await members.press('ArrowRight');
  await expect(settings).toBeFocused();
  await expect(members).toHaveAttribute('aria-selected', 'true');
  await settings.press('Enter');
  await expect(settings).toHaveAttribute('aria-selected', 'true');

  await page.goto('/iframe.html?id=components-tabs--custom-indicator');
  const projects = page.getByRole('tab', { name: 'Projects' });
  await projects.click();
  const indicator = page.locator('[data-tabs-indicator]');
  const tabBox = await projects.boundingBox();
  if (!tabBox) throw new Error('The selected tab must be visible.');
  await expect
    .poll(
      /** Read the indicator after the primitive applies its selected-tab geometry. */
      async () => (await indicator.boundingBox())?.x,
    )
    .toBeCloseTo(tabBox.x, 0);
  await expect
    .poll(
      /** Wait for the primitive's width transition to reach the selected tab. */
      async () => (await indicator.boundingBox())?.width,
    )
    .toBeCloseTo(tabBox.width, 0);
  await expect(indicator).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  await expect(indicator).toHaveCSS('border-radius', '9999px');
}

test('all Tabs examples render', verifiesInventory);
test('Tabs selection and external state work', verifiesSelection);
test('Tabs lazy and nested panels work', verifiesLifecycle);
test('Tabs can be added and removed', verifiesDynamicTabs);
test('Tabs matrices and responsive orientation work', verifiesVariants);
test('Tabs variant structures work', verifiesStructures);
test('Tabs active keyboard and indicator states work', verifiesActiveStates);
