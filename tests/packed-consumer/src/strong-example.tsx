import { Strong } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Strong semantics, CSS overrides, refs, and reactivity. */
export function PackedStrong(): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Mark the native element delivered through the public ref. */
  function markStrong(element: HTMLElement): void {
    element.dataset.packedStrongRef = element.tagName.toLowerCase();
  }

  /** Change the consumer weight on the same native element. */
  function toggleWeight(): void {
    setPlain(!plain());
  }

  return (
    <section>
      <p>
        Before{' '}
        <Strong id="packed-native-strong" ref={markStrong}>
          important
        </Strong>{' '}
        after
      </p>
      <div class="packed-strong-css">
        <Strong id="packed-css-strong">Consumer override</Strong>
      </div>
      <Strong as="a" href="#packed-strong-target" id="packed-link-strong" ref={markStrong}>
        Important link
      </Strong>
      <Strong
        id="packed-reactive-strong"
        class={plain() ? 'packed-strong-reactive-plain' : undefined}
      >
        Reactive importance
      </Strong>
      <button type="button" id="packed-strong-toggle" onClick={toggleWeight}>
        Toggle strong weight
      </button>
    </section>
  );
}
