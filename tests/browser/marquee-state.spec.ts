import { expect, test, type Page } from '@playwright/test';

/** Verify external machine methods update a stable provider root. */
async function verifiesMarqueeStore({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-state--store');
  const root = page.getByTestId('marquee-store-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-paused', '');
  await expect(page.getByTestId('marquee-state')).toHaveText('paused');
  await root.evaluate(
    /** Mark the original DOM node before the external machine changes. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('marquee-store-toggle').click();
  await expect(root).toHaveAttribute('data-original', 'true');
  await expect(root).toHaveAttribute('data-state', 'idle');
  await expect(page.getByTestId('marquee-state')).toHaveText('playing');
}

test('Marquee RootProvider follows its external machine', verifiesMarqueeStore);

/** Verify defaults, orientation, and interaction pause update reactively. */
async function verifiesReactiveMarquee({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-state--reactive');
  const root = page.getByTestId('marquee-reactive-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-orientation', 'horizontal');
  await expect
    .poll(
      /** Read the inherited spacing through the public CSS variable. */
      async () =>
        root.evaluate(
          /** Resolve the mounted root's current spacing. */
          (element) => getComputedStyle(element).getPropertyValue('--marquee-spacing').trim(),
        ),
    )
    .toBe('8px');
  await root.hover();
  await expect(root).toHaveAttribute('data-paused', '');
  await page.getByTestId('marquee-switch-side').hover();
  await expect(root).toHaveAttribute('data-state', 'idle');
  await page.getByTestId('marquee-focus-target').first().focus();
  await expect(root).toHaveAttribute('data-paused', '');
  await page.getByTestId('marquee-switch-side').focus();
  await expect(root).toHaveAttribute('data-state', 'idle');
  await root.evaluate(
    /** Mark the mounted root before changing inherited direction. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('marquee-switch-side').click();
  await expect(root).toHaveAttribute('data-original', 'true');
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect
    .poll(
      /** Read spacing again after the provider changes orientation. */
      async () =>
        root.evaluate(
          /** Resolve the updated root spacing. */
          (element) => getComputedStyle(element).getPropertyValue('--marquee-spacing').trim(),
        ),
    )
    .toBe('20px');
}

test('Marquee defaults and hover/focus pause stay reactive', verifiesReactiveMarquee);

/** Verify caller-owned pause state stays in sync with machine requests. */
async function verifiesControlledPause({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-state--controlled');
  const root = page.getByTestId('marquee-controlled-root');
  const toggle = page.getByTestId('marquee-controlled-toggle');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('marquee-state')).toHaveText('playing');
  await toggle.click();
  await expect(root).toHaveAttribute('data-paused', '');
  await toggle.click();
  await expect(root).toHaveAttribute('data-state', 'idle');
  await root.hover();
  await expect(root).toHaveAttribute('data-paused', '');
  await toggle.hover();
  await expect(root).toHaveAttribute('data-state', 'idle');
}

test('Marquee controlled pause responds to caller and machine', verifiesControlledPause);

/** Verify the root ref bridge survives caller-owned native element rendering. */
async function verifiesChildRootFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee-state--child-root');
  const root = page.getByTestId('marquee-child-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  expect(
    await root.evaluate(
      /** Read the caller-selected native element tag. */
      (element) => element.tagName,
    ),
  ).toBe('SECTION');
  await expect(page.getByTestId('marquee-child-refs')).toHaveText('matched');
  await page.getByTestId('marquee-child-focus').first().focus();
  await expect(root).toHaveAttribute('data-paused', '');
}

test('Marquee asChild root preserves both refs and focus pause', verifiesChildRootFocus);
