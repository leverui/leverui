import { Text } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import './text-example.css';

/** Exercise published Text clipping and consumer CSS in an isolated app. */
export function PackedText(): JSX.Element {
  const [active, setActive] = createSignal(true);

  /** Toggle both clipping props without changing the rendered elements. */
  function toggleClipping(): void {
    setActive(!active());
  }

  return (
    <section>
      <Text as="article" id="packed-text" class="packed-text">
        Packed text
      </Text>
      <Text id="packed-truncate" truncate={active()}>
        A long sentence that can truncate
      </Text>
      <Text id="packed-clamp" lineClamp={active() ? '2' : 'none'}>
        A longer paragraph that can be clamped
      </Text>
      <button id="packed-text-toggle" type="button" onClick={toggleClipping}>
        Toggle clipping
      </button>
    </section>
  );
}
