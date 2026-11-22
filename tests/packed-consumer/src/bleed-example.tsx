import { Bleed } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed logical margins, polymorphism, and live spacing. */
export function PackedBleed(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Record the native section received through the public ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.bleedRef = element.tagName.toLowerCase();
  }

  /** Change spacing while keeping the installed element mounted. */
  function toggleSpacing(): void {
    setWide(!wide());
  }

  return (
    <section id="packed-bleed-example">
      <div id="packed-bleed-parent" style={{ width: '240px', padding: '32px' }}>
        <Bleed
          as="section"
          id="packed-bleed"
          ref={markSection}
          inline={wide() ? '8' : '4'}
          blockStart="2"
          style={{ height: '40px' }}
          aria-label="Packed bleed"
        >
          Installed bleed
        </Bleed>
      </div>
      <div id="packed-rtl-bleed-parent" style={{ width: '240px', padding: '32px' }} dir="rtl">
        <Bleed id="packed-rtl-bleed" inlineStart="8" style={{ height: '40px' }}>
          RTL bleed
        </Bleed>
      </div>
      <button id="packed-bleed-toggle" type="button" onClick={toggleSpacing}>
        Change packed bleed
      </button>
    </section>
  );
}
