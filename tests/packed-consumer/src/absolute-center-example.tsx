import { AbsoluteCenter } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed default, reactive, and RTL layout in a separate app. */
export function PackedAbsoluteCenter(): JSX.Element {
  const [horizontal, setHorizontal] = createSignal(false);

  /** Record the selected native element supplied through the public ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the installed component's axis without replacing its node. */
  function toggleAxis(): void {
    setHorizontal(!horizontal());
  }

  return (
    <section id="packed-absolute-center">
      <div
        id="packed-center-parent"
        style={{ position: 'relative', width: '240px', height: '160px' }}
      >
        <AbsoluteCenter
          as="section"
          ref={markSection}
          id="packed-center"
          axis={horizontal() ? 'horizontal' : 'both'}
          style={{ width: '60px', height: '40px' }}
        >
          Packed center
        </AbsoluteCenter>
      </div>
      <div
        id="packed-rtl-center-parent"
        dir="rtl"
        style={{ position: 'relative', width: '240px', height: '160px' }}
      >
        <AbsoluteCenter
          id="packed-rtl-center"
          axis="horizontal"
          style={{ top: '12px', width: '60px', height: '40px' }}
        >
          وسط
        </AbsoluteCenter>
      </div>
      <button id="packed-axis-toggle" type="button" onClick={toggleAxis}>
        Change packed axis
      </button>
    </section>
  );
}
