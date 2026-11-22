import { expect, type Locator } from '@playwright/test';

/** Check that an open popup remains aligned with its trigger inside its overlay. */
export async function expectSelectGuidePlacement(
  trigger: Locator,
  positioner: Locator,
  overlay: Locator,
): Promise<void> {
  await expect(positioner).toBeVisible();
  await expect(
    /** Retry while Zag updates placement after layout changes. */
    async () => {
      const triggerBox = await trigger.boundingBox();
      const popupBox = await positioner.boundingBox();
      const overlayBox = await overlay.boundingBox();
      expect(triggerBox).not.toBeNull();
      expect(popupBox).not.toBeNull();
      expect(overlayBox).not.toBeNull();
      if (!triggerBox || !popupBox || !overlayBox) return;

      expect(Math.abs(popupBox.x - triggerBox.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(popupBox.width - triggerBox.width)).toBeLessThanOrEqual(2);
      expect(popupBox.y).toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height - 2);
      expect(popupBox.x).toBeGreaterThanOrEqual(overlayBox.x - 2);
      expect(popupBox.x + popupBox.width).toBeLessThanOrEqual(overlayBox.x + overlayBox.width + 2);
    },
  ).toPass({ timeout: 5_000 });
}

/** Move an overlay to exercise live placement after its ancestor shifts. */
export async function moveSelectGuideOverlay(overlay: Locator): Promise<void> {
  await overlay.evaluate(
    /** Shift the rendered overlay without moving its Select trigger directly. */
    (element) => {
      if (!(element instanceof HTMLElement)) throw new TypeError('Expected an overlay element.');
      element.style.transform = 'translateX(24px)';
    },
  );
}
