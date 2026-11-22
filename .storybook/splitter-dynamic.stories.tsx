import { Show, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter } from '../src';

/** Add and remove a panel while the mounted splitter stays interactive. */
function DynamicExample(): JSX.Element {
  const [third, setThird] = createSignal(false);

  /** Toggle the third panel and its adjacent resize handle. */
  function toggleThird(): void {
    setThird(!third());
  }

  return (
    <>
      <button type="button" onClick={toggleThird} data-testid="splitter-toggle-third">
        Toggle third
      </button>
      <div style={{ width: '450px', height: '120px' }}>
        <Splitter.Root
          panels={third() ? [{ id: 'a' }, { id: 'b' }, { id: 'c' }] : [{ id: 'a' }, { id: 'b' }]}
          defaultSize={third() ? [30, 40, 30] : [50, 50]}
          data-testid="splitter-dynamic-root"
        >
          <Splitter.Panel id="a" data-testid="splitter-dynamic-a">
            A
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" data-testid="splitter-dynamic-first" />
          <Splitter.Panel id="b" data-testid="splitter-dynamic-b">
            B
          </Splitter.Panel>
          <Show when={third()}>
            <Splitter.ResizeTrigger id="b:c" data-testid="splitter-dynamic-second" />
            <Splitter.Panel id="c" data-testid="splitter-dynamic-c">
              C
            </Splitter.Panel>
          </Show>
        </Splitter.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Layout/Splitter Dynamic',
  component: DynamicExample,
} satisfies Meta<typeof DynamicExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Panels: Story = {};
