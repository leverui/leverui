import { Quote } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed quotation types, native refs, CSS, and live props. */
export function PackedQuote(): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Mark the native q element received through the public ref. */
  function markQuote(element: HTMLQuoteElement): void {
    element.dataset.packedQuoteRef = element.tagName.toLowerCase();
  }

  /** Mark a selected anchor when it receives its native click event. */
  function markAnchorClick(event: MouseEvent & { currentTarget: HTMLAnchorElement }): void {
    event.currentTarget.dataset.packedAnchorClicked = 'true';
  }

  /** Change the installed quotation's consumer class. */
  function toggleWeight(): void {
    setPlain(!plain());
  }

  return (
    <section>
      <Quote id="packed-native-quote" cite="https://example.com/packed" ref={markQuote}>
        Native quotation
      </Quote>
      <div class="packed-quote-css">
        <Quote id="packed-css-quote">Consumer quotation</Quote>
      </div>
      <Quote
        as="a"
        href="#packed-quote-target"
        onClick={markAnchorClick}
        ref={
          /** Confirm the selected anchor retains its precise ref type. */
          (element: HTMLAnchorElement) => (element.dataset.packedAnchorRef = 'true')
        }
        id="packed-link-quote"
      >
        Linked quotation
      </Quote>
      <Quote id="packed-reactive-quote" class={plain() ? 'packed-quote-reactive-plain' : undefined}>
        Reactive quotation
      </Quote>
      <button type="button" id="packed-quote-toggle" onClick={toggleWeight}>
        Toggle quote weight
      </button>
    </section>
  );
}
