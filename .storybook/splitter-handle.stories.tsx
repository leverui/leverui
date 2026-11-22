import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter } from '../src';

/** Exercise a separator-only handle with keyboard, pointer, and reset events. */
function HandleExample(): JSX.Element {
  const [starts, setStarts] = createSignal(0);
  const [ends, setEnds] = createSignal(0);

  /** Count the beginning of a primitive pointer resize operation. */
  function recordStart(): void {
    setStarts(
      /** Advance the pointer resize start count. */
      (count) => count + 1,
    );
  }

  /** Count completion after keyboard or pointer resizing. */
  function recordEnd(): void {
    setEnds(
      /** Advance the resize completion count. */
      (count) => count + 1,
    );
  }

  return (
    <>
      <output data-testid="splitter-handle-starts">{starts()}</output>
      <output data-testid="splitter-handle-ends">{ends()}</output>
      <div style={{ width: '400px', height: '120px' }}>
        <Splitter.Root
          panels={[{ id: 'a' }, { id: 'b' }]}
          defaultSize={[40, 60]}
          keyboardResizeBy={5}
          onResizeStart={recordStart}
          onResizeEnd={recordEnd}
        >
          <Splitter.Panel id="a" data-testid="splitter-handle-a">
            A
          </Splitter.Panel>
          <Splitter.Context>
            {
              /** Bind the documented reset action to the native handle. */
              (context) => (
                <Splitter.ResizeTrigger
                  id="a:b"
                  data-testid="splitter-handle-trigger"
                  onDblClick={
                    /** Restore default sizes on a double click. */
                    () => context().resetSizes()
                  }
                >
                  <Splitter.ResizeTriggerSeparator data-testid="splitter-handle-separator" />
                </Splitter.ResizeTrigger>
              )
            }
          </Splitter.Context>
          <Splitter.Panel id="b">B</Splitter.Panel>
        </Splitter.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Layout/Splitter Handle',
  component: HandleExample,
} satisfies Meta<typeof HandleExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SeparatorOnly: Story = {};
