import { Splitter, type SplitterResizeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise the installed compound API and its keyboard resize callback. */
export function PackedSplitter(): JSX.Element {
  const [size, setSize] = createSignal(40);

  /** Display the first panel size reported by the installed machine. */
  function recordResize(details: SplitterResizeDetails): void {
    setSize(details.size[0] ?? 0);
  }

  return (
    <div style={{ width: '300px', height: '100px' }}>
      <output id="packed-splitter-size">{size()}</output>
      <Splitter.Root
        panels={[{ id: 'a' }, { id: 'b' }]}
        defaultSize={[40, 60]}
        onResize={recordResize}
      >
        <Splitter.Panel id="a" data-testid="packed-splitter-a">
          First
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" data-testid="packed-splitter-trigger" />
        <Splitter.Panel id="b" data-testid="packed-splitter-b">
          Second
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}
