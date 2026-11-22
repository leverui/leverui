import { expect, test, type Page } from '@playwright/test';

/** Verify public parts, duplicate accessibility, and edge styling. */
async function verifiesMarqueeContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-marquee--contract');
  const root = page.getByTestId('marquee-root');
  const content = page.getByTestId('marquee-content');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('role', 'region');
  await expect(root).toHaveAttribute('aria-roledescription', 'marquee');
  await expect(root).toHaveAttribute('aria-live', 'off');
  await expect(root).toHaveAttribute('aria-label', 'Featured items');
  await expect(root).toHaveAttribute('data-orientation', 'horizontal');
  const spacing = await root.evaluate(
    /** Read Zag's spacing integration value after the CSS cascade. */
    (element) => getComputedStyle(element).getPropertyValue('--marquee-spacing').trim(),
  );
  expect(spacing).toBe('24px');
  await expect(content).toHaveCount(2);
  await expect(content.nth(0)).toHaveAttribute('data-index', '0');
  await expect(content.nth(1)).toHaveAttribute('aria-hidden', 'true');
  await expect(content.nth(1)).toHaveAttribute('role', 'presentation');
  await expect(page.getByTestId('marquee-item')).toHaveCount(6);
  await expect(page.getByTestId('marquee-start-edge')).toHaveAttribute('data-side', 'start');
  await expect(page.getByTestId('marquee-end-edge')).toHaveAttribute('data-side', 'end');
  const gradient = await page.getByTestId('marquee-start-edge').evaluate(
    /** Read the styled fade rather than only its machine attribute. */
    (element) => getComputedStyle(element).backgroundImage,
  );
  expect(gradient).toContain('linear-gradient');
}

test('Marquee exposes semantic parts, duplicate copies, and edge fades', verifiesMarqueeContract);
