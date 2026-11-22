import { Separator, SeparatorPropsProvider } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed separator types, native refs, CSS, and provider changes. */
export function PackedSeparator(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Mark the native span received through the public ref. */
  function markSpan(element: HTMLSpanElement): void {
    element.dataset.packedSeparatorRef = element.tagName.toLowerCase();
  }

  /** Change the installed provider's size without remounting its child. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <section>
      <Separator id="packed-native-separator" ref={markSpan} />
      <div class="packed-separator-css">
        <Separator id="packed-css-separator" />
      </div>
      <Separator
        as="div"
        id="packed-selected-separator"
        orientation="vertical"
        style={{ height: '24px' }}
        ref={
          /** Mark the selected native element through its precise ref type. */
          (element: HTMLDivElement) => (element.dataset.packedSelectedRef = 'true')
        }
      />
      <SeparatorPropsProvider
        value={
          /** Read the current shared size from the consumer signal. */
          () => ({ size: large() ? 'lg' : 'xs' })
        }
      >
        <Separator id="packed-inherited-separator" />
      </SeparatorPropsProvider>
      <SeparatorPropsProvider value={{ orientation: 'vertical' }}>
        <Separator id="packed-provider-orientation-separator" style={{ height: '24px' }} />
      </SeparatorPropsProvider>
      <button type="button" id="packed-separator-toggle" onClick={toggleSize}>
        Toggle separator size
      </button>
    </section>
  );
}
