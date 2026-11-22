import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter } from '../src';

const twoPanels = [{ id: 'a' }, { id: 'b' }];

/** Exercise the default handle, keyboard resizing, dragging, and events. */
function BasicSplitterExample(): JSX.Element {
  const [resizes, setResizes] = createSignal(0);
  const [ends, setEnds] = createSignal(0);

  /** Count live changes reported by Zag's resize machine. */
  function recordResize(): void {
    setResizes(
      /** Advance the live resize event count. */
      (count) => count + 1,
    );
  }

  /** Count completed pointer or keyboard resize operations. */
  function recordResizeEnd(): void {
    setEnds(
      /** Advance the completed resize event count. */
      (count) => count + 1,
    );
  }

  return (
    <>
      <output data-testid="splitter-resize-count">{resizes()}</output>
      <output data-testid="splitter-end-count">{ends()}</output>
      <Splitter.Root
        panels={twoPanels}
        defaultSize={[40, 60]}
        style={{ width: '360px', height: '180px', 'border-width': '1px' }}
        onResize={recordResize}
        onResizeEnd={recordResizeEnd}
        data-testid="splitter-root"
      >
        <Splitter.Panel id="a" data-testid="splitter-panel-a">
          First panel
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" data-testid="splitter-trigger" />
        <Splitter.Panel id="b" data-testid="splitter-panel-b">
          Second panel
        </Splitter.Panel>
      </Splitter.Root>
    </>
  );
}

const meta = {
  title: 'Layout/Splitter',
  component: BasicSplitterExample,
} satisfies Meta<typeof BasicSplitterExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
