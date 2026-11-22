import { Show } from '@leverui/components';
import { createSignal, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed Show fallback and narrowed reactive value. */
export function PackedShow(): JSX.Element {
  const [value, setValue] = createSignal<number | undefined>();

  /** Enter the installed Show's truthy branch. */
  function reveal(): void {
    setValue(10);
  }

  /** Update a value while preserving the mounted branch. */
  function increment(): void {
    setValue((value() ?? 0) + 1);
  }

  /** Return the installed Show to its fallback. */
  function hide(): void {
    setValue(undefined);
  }

  /** Read the narrowed value through Solid's tracked JSX. */
  function renderValue(current: Accessor<number>): JSX.Element {
    return <output id="packed-show-value">Value: {current()}</output>;
  }

  return (
    <section id="packed-show">
      <button id="packed-show-reveal" type="button" onClick={reveal}>
        Reveal
      </button>
      <button id="packed-show-increment" type="button" onClick={increment}>
        Increment
      </button>
      <button id="packed-show-hide" type="button" onClick={hide}>
        Hide
      </button>
      <Show when={value()} fallback={<span id="packed-show-fallback">Missing</span>}>
        {renderValue}
      </Show>
    </section>
  );
}
