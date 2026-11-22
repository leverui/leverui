import type { Page } from '@playwright/test';

export interface DragPoint {
  readonly x: number;
  readonly y: number;
}

/** Supply movement deltas missing from Playwright's WebKit mouse events. */
export async function dragMouseTo(page: Page, from: DragPoint, to: DragPoint): Promise<void> {
  if (page.context().browser()?.browserType().name() !== 'webkit') {
    await page.mouse.move(to.x, to.y, { steps: 10 });
    return;
  }

  const movementX = (to.x - from.x) / 10;
  const movementY = (to.y - from.y) / 10;
  for (let step = 1; step <= 10; step += 1) {
    await page.evaluate(
      /** Deliver the mouse and pointer streams read by Zag's drag machines. */
      ({ x, y, movementX, movementY }) => {
        const init = { bubbles: true, buttons: 1, clientX: x, clientY: y };
        const pointer = new PointerEvent('pointermove', { ...init, pointerType: 'mouse' });
        const mouse = new MouseEvent('mousemove', init);
        for (const event of [pointer, mouse]) {
          Object.defineProperty(event, 'movementX', { value: movementX });
          Object.defineProperty(event, 'movementY', { value: movementY });
          document.dispatchEvent(event);
        }
      },
      {
        x: from.x + movementX * step,
        y: from.y + movementY * step,
        movementX,
        movementY,
      },
    );
  }
}
