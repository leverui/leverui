import { Box, Float } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise an installed Float in a positioned parent. */
export function PackedFloat(): JSX.Element {
  const [bottom, setBottom] = createSignal(false);

  /** Record the selected native button from the installed declaration. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.floatRef = element.tagName.toLowerCase();
  }

  /** Move the installed Float without replacing its child. */
  function togglePlacement(): void {
    setBottom(!bottom());
  }

  return (
    <Box id="packed-float-parent" class="packed-box-float-parent">
      <Float
        as="button"
        type="button"
        id="packed-float"
        ref={markButton}
        placement={bottom() ? 'bottom-end' : 'top-start'}
        style={{ width: '20px', height: '20px' }}
        onClick={togglePlacement}
        aria-label="Packed float"
      >
        <span id="packed-float-child">3</span>
      </Float>
    </Box>
  );
}
