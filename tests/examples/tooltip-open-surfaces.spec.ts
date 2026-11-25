import { expect, test, type Locator, type Page } from '@playwright/test';
import { waitForFonts } from './fonts';

/** Open a named Tooltip example and return its visible surface. */
async function openTooltip(page: Page, example: string, triggerName: string): Promise<Locator> {
  await page.goto(`/iframe.html?id=components-tooltip--${example}`);
  await page.getByRole('button', { name: triggerName }).hover();
  const content = page.locator('[data-tooltip-content]');
  await expect(content).toBeVisible();
  await waitForFonts(page);
  return content;
}

/** Compare a browser box with the measured one, allowing for Linux and macOS text widths. */
async function expectReferenceBox(
  locator: Locator,
  reference: { x: number; y: number; width: number; height: number },
): Promise<void> {
  await expect
    .poll(
      /** Measure the largest distance from the expected box, retrying while it settles. */
      async () => {
        const box = await locator.boundingBox();
        if (!box) throw new Error('The open Tooltip surface has no browser bounds.');
        return Math.max(
          Math.abs(box.x - reference.x),
          Math.abs(box.y - reference.y),
          Math.abs(box.width - reference.width),
          Math.abs(box.height - reference.height),
        );
      },
    )
    .toBeLessThan(5);
}

/** Preserve the bottom surface and eight-pixel arrow. */
async function verifiesArrowSurface({ page }: { page: Page }): Promise<void> {
  const content = await openTooltip(page, 'arrow', 'Hover me');
  await expectReferenceBox(content, { x: 10, y: 104, width: 185.91, height: 24 });
  await expect(content).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  const arrow = page.locator('[data-tooltip-arrow]');
  await expectReferenceBox(arrow, { x: 98.5, y: 100, width: 8, height: 8 });
  await expect(page.locator('[data-tooltip-arrow-tip]')).toHaveCSS(
    'background-color',
    'rgb(9, 9, 11)',
  );
}

/** Keep custom background color on both the surface and its arrow tip. */
async function verifiesCustomBackground({ page }: { page: Page }): Promise<void> {
  const content = await openTooltip(page, 'custom-bg', '3');
  await expectReferenceBox(content, { x: 8, y: 104, width: 179.81, height: 24 });
  await expect(content).toHaveCSS('background-color', 'rgb(255, 99, 71)');
  await expect(page.locator('[data-tooltip-arrow-tip]')).toHaveCSS(
    'background-color',
    'rgb(255, 99, 71)',
  );
}

/** Preserve the explicit offset on both axes. */
async function verifiesOffset({ page }: { page: Page }): Promise<void> {
  const content = await openTooltip(page, 'offset', 'Hover me');
  await expectReferenceBox(content, { x: 14, y: 96, width: 185.91, height: 24 });
  await expect(content).toHaveAttribute('data-placement', 'bottom');
}

/** Preserve the right-end floating placement. */
async function verifiesPlacement({ page }: { page: Page }): Promise<void> {
  const content = await openTooltip(page, 'placement', 'Hover me');
  await expectReferenceBox(content, { x: 158, y: 68, width: 185.91, height: 24 });
  await expect(content).toHaveAttribute('data-placement', 'right-end');
}

/** Keep an interactive Tooltip surface available to pointer input. */
async function verifiesInteractiveSurface({ page }: { page: Page }): Promise<void> {
  const content = await openTooltip(page, 'interactive', 'Hover me');
  await expectReferenceBox(content, { x: 8, y: 100, width: 255.61, height: 24 });
  await expect(content).toHaveCSS('pointer-events', 'auto');
  await expect(content).toHaveCSS('z-index', '1800');
}

test('Tooltip arrow matches the open surface', verifiesArrowSurface);
test('Tooltip custom background reaches the arrow', verifiesCustomBackground);
test('Tooltip offset matches the open surface', verifiesOffset);
test('Tooltip placement matches the open surface', verifiesPlacement);
test('Tooltip interactive surface retains pointer input', verifiesInteractiveSurface);
