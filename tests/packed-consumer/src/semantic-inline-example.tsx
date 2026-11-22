import { Em, Quote, Span, Strong } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import './semantic-inline-example.css';

/** Exercise authored semantic inline defaults with live consumer overrides. */
export function PackedSemanticInline(): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Switch the three mounted elements through consumer CSS classes. */
  function toggleStyle(): void {
    setPlain(!plain());
  }

  return (
    <section>
      <Em id="packed-em" class={plain() ? 'packed-em-plain' : undefined}>
        Emphasized text
      </Em>
      <Em id="packed-em-override" class="packed-em-override">
        Consumer override
      </Em>
      <Strong id="packed-strong" class={plain() ? 'packed-strong-plain' : undefined}>
        Important text
      </Strong>
      <Strong id="packed-strong-override" class="packed-strong-override">
        Consumer weight
      </Strong>
      <Quote id="packed-quote" class={plain() ? 'packed-quote-plain' : undefined}>
        Quoted text
      </Quote>
      <Quote id="packed-quote-override" class="packed-quote-override">
        Consumer quotation
      </Quote>
      <Span id="packed-span" class={plain() ? 'packed-span packed-span-plain' : 'packed-span'}>
        Inline segment
      </Span>
      <button id="packed-inline-toggle" type="button" onClick={toggleStyle}>
        Toggle typography
      </button>
    </section>
  );
}
