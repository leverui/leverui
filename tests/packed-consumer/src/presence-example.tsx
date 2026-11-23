import { Presence } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Presence type, native output, and Zag state. */
export function PackedPresence(): JSX.Element {
  const [present, setPresent] = createSignal(false);

  /** Toggle the packaged presence element without replacing its owner. */
  function togglePresent(): void {
    setPresent(!present());
  }

  return (
    <section id="packed-presence">
      <button id="packed-presence-toggle" type="button" onClick={togglePresent}>
        Toggle presence
      </button>
      <Presence
        id="packed-presence-content"
        present={present()}
        style={{ padding: 'var(--lui-spacing-4)' }}
      >
        Installed presence
      </Presence>
    </section>
  );
}
