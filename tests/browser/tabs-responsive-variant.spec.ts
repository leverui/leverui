import { expect, test, type Locator, type Page } from '@playwright/test';

const widths = [400, 600, 800, 1100, 1300, 1600] as const;

/** Read selected appearance from the same visible Tabs parts. */
async function readVariant(root: Locator): Promise<Record<string, string>> {
  return root.evaluate(
    /** Sample computed presentation after the active media query settles. */
    (element) => {
      const list = element.querySelector('.lui-tabs__list');
      const trigger = element.querySelector('.lui-tabs__trigger[data-selected]');
      if (!list || !trigger) throw new Error('Selected Tabs parts are missing.');
      const listStyle = getComputedStyle(list);
      const triggerStyle = getComputedStyle(trigger);
      return {
        listBackground: listStyle.backgroundColor,
        listDisplay: listStyle.display,
        triggerBackground: triggerStyle.backgroundColor,
        triggerColor: triggerStyle.color,
        triggerRadius: triggerStyle.borderRadius,
        triggerShadow: triggerStyle.boxShadow,
      };
    },
  );
}

/** Require responsive variants to switch surfaces at every breakpoint. */
async function verifiesResponsiveVariant({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tabs-responsive-variant--contract');
  const authored = page.getByTestId('tabs-variant-authored');
  await expect(authored).toBeVisible({ timeout: 30_000 });
  await expect(authored).toHaveAttribute('data-variant', 'subtle');
  await expect(authored).toHaveAttribute('data-variant-sm', 'plain');
  await expect(authored).toHaveAttribute('data-variant-2xl', 'plain');
  let basePresentation: Record<string, string> | undefined;
  for (const [index, width] of widths.entries()) {
    await page.setViewportSize({ width, height: 800 });
    const current = await readVariant(authored);
    if (index === 0) {
      basePresentation = current;
      expect(current.triggerBackground).not.toBe('rgba(0, 0, 0, 0)');
    } else if (index % 2 === 0) {
      expect(current.triggerBackground, `${width}px subtle`).toBe(
        basePresentation?.triggerBackground,
      );
    } else {
      expect(current.triggerBackground, `${width}px plain`).toBe('rgba(0, 0, 0, 0)');
    }
    expect(current.triggerColor, `${width}px color`).toBe(basePresentation?.triggerColor);
    expect(current.triggerRadius, `${width}px radius`).toBe(basePresentation?.triggerRadius);
  }
}

test(
  'subtle and plain Tabs variants use authored CSS at every breakpoint',
  verifiesResponsiveVariant,
);

/** Check all five variants can replace each other at successive breakpoints. */
async function verifiesEveryResponsiveVariant({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tabs-responsive-variant--contract');
  const root = page.getByTestId('tabs-variant-all');
  await expect(root).toHaveAttribute('data-variant', 'line');
  await expect(root).toHaveAttribute('data-variant-sm', 'outline');
  await expect(root).toHaveAttribute('data-variant-md', 'enclosed');
  await expect(root).toHaveAttribute('data-variant-lg', 'subtle');
  await expect(root).toHaveAttribute('data-variant-xl', 'plain');
  await expect(root).toHaveAttribute('data-variant-2xl', 'line');
  for (const [index, width] of widths.entries()) {
    await page.setViewportSize({ width, height: 800 });
    const current = await readVariant(root);
    expect(current.listDisplay, `${width}px list`).toBe(
      index < 2 || index === 5 ? 'flex' : 'inline-flex',
    );
    expect(current.listBackground === 'rgba(0, 0, 0, 0)', `${width}px list surface`).toBe(
      index !== 2,
    );
    expect(current.triggerBackground === 'rgba(0, 0, 0, 0)', `${width}px selected surface`).toBe(
      index === 0 || index === 4 || index === 5,
    );
  }
}

test('every finite responsive Tabs variant uses authored CSS', verifiesEveryResponsiveVariant);

/** Require a signal update without replacing the native trigger. */
async function verifiesReactiveVariant({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-tabs-responsive-variant--contract');
  const root = page.getByTestId('tabs-variant-reactive');
  const trigger = page.getByTestId('tabs-variant-reactive-trigger');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-variant', 'subtle');
  await trigger.evaluate(
    /** Mark the original native trigger to detect remounts. */
    (element) => {
      (element as HTMLElement).dataset.original = 'true';
    },
  );
  await page.getByTestId('tabs-variant-toggle').click();
  await expect(root).toHaveAttribute('data-variant', 'plain');
  await expect(root).toHaveAttribute('data-variant-md', 'subtle');
  await expect(trigger).toHaveAttribute('data-original', 'true');
}

test('responsive Tabs variants stay reactive without remounting', verifiesReactiveVariant);

/** Let consumer CSS change a public token and a stable part selector. */
async function verifiesConsumerOverrides({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/iframe.html?id=internal-tabs-responsive-variant--contract');
  const root = page.getByTestId('tabs-variant-authored');
  const trigger = root.locator('.lui-tabs__trigger[data-selected]');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await page.addStyleTag({
    content: `[data-testid='tabs-variant-authored'] {
      --lui-colors-color-palette-subtle: rgb(10 90 150);
    }`,
  });
  await expect(trigger).toHaveCSS('background-color', 'rgb(10, 90, 150)');
  await page.addStyleTag({
    content: `[data-testid='tabs-variant-authored'] .lui-tabs__trigger[data-selected] {
      background: rgb(20 30 40);
    }`,
  });
  await expect(trigger).toHaveCSS('background-color', 'rgb(20, 30, 40)');
}

test('consumer CSS overrides responsive Tabs tokens and parts', verifiesConsumerOverrides);
