import { Span } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Span refs, CSS, and reactive consumer classes. */
export function PackedSpan(): JSX.Element {
  const [bold, setBold] = createSignal(false);

  /** Mark the native span received through the public ref. */
  function markSpan(element: HTMLSpanElement): void {
    element.dataset.packedSpanRef = element.tagName.toLowerCase();
  }

  /** Record a native click on the selected anchor. */
  function markAnchorClick(event: MouseEvent & { currentTarget: HTMLAnchorElement }): void {
    event.currentTarget.dataset.packedAnchorClicked = 'true';
  }

  /** Change consumer CSS without replacing the installed span. */
  function toggleWeight(): void {
    setBold(!bold());
  }

  return (
    <section>
      <p>
        Before{' '}
        <Span id="packed-native-span" ref={markSpan}>
          inline
        </Span>{' '}
        after
      </p>
      <div class="packed-span-css">
        <Span id="packed-css-span">Consumer override</Span>
      </div>
      <Span
        as="a"
        href="#packed-span-target"
        id="packed-link-span"
        onClick={markAnchorClick}
        ref={
          /** Prove a selected anchor receives its precise ref type. */
          (element: HTMLAnchorElement) => (element.dataset.packedAnchorRef = 'true')
        }
      >
        Linked segment
      </Span>
      <Span id="packed-reactive-span" class={bold() ? 'packed-span-bold' : undefined}>
        Reactive segment
      </Span>
      <button type="button" id="packed-span-toggle" onClick={toggleWeight}>
        Toggle span weight
      </button>
    </section>
  );
}
