import { Square } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Square sizing, native refs, and centered content. */
export function PackedSquare(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Record the native button supplied through the installed ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.squareRef = element.tagName.toLowerCase();
  }

  /** Change Square size through the installed reactive API. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <section id="packed-square-example">
      <Square
        as="button"
        type="button"
        id="packed-square"
        ref={markButton}
        size={large() ? '12' : '8'}
        onClick={toggleSize}
        aria-label="Packed square"
      >
        <div id="packed-square-child" style={{ width: '10px', height: '10px' }}>
          S
        </div>
      </Square>
    </section>
  );
}
