import { Status, StatusPropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Status types, slots, palette, and live provider defaults. */
export function PackedStatus(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change shared size and palette without remounting the root. */
  function toggleStatus(): void {
    setLarge(!large());
  }

  /** Mark the native div delivered through the public ref. */
  function markRoot(element: HTMLDivElement): void {
    element.dataset.packedStatusRef = 'div';
  }

  return (
    <section>
      <Status.Root id="packed-status" ref={markRoot} colorPalette="red">
        <Status.Indicator id="packed-status-indicator" />
        Pending
      </Status.Root>
      <Status.Root id="packed-status-large" size="lg" colorPalette="green">
        <Status.Indicator id="packed-status-large-indicator" />
        Ready
      </Status.Root>
      <StatusPropsProvider
        value={
          /** Read current shared values from the consumer signal. */
          () => ({ size: large() ? 'lg' : 'sm', colorPalette: large() ? 'green' : 'red' })
        }
      >
        <Status.Root id="packed-reactive-status">
          <Status.Indicator id="packed-reactive-status-indicator" />
          Reactive
        </Status.Root>
      </StatusPropsProvider>
      <button type="button" id="packed-status-toggle" onClick={toggleStatus}>
        Toggle Status
      </button>
    </section>
  );
}
