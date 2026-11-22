import { Circle } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Circle sizing, native refs, and centered content. */
export function PackedCircle(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Record the native button supplied through the installed ref. */
  function markButton(element: HTMLButtonElement): void {
    element.dataset.circleRef = element.tagName.toLowerCase();
  }

  /** Change Circle size through the installed reactive API. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <section id="packed-circle-example">
      <Circle
        as="button"
        type="button"
        id="packed-circle"
        ref={markButton}
        size={large() ? '12' : '8'}
        onClick={toggleSize}
        aria-label="Packed circle"
      >
        <div id="packed-circle-child" style={{ width: '10px', height: '10px' }}>
          C
        </div>
      </Circle>
    </section>
  );
}
