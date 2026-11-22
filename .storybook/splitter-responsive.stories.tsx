import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter } from '../src';

/** Change orientation without replacing mounted panels or the handle. */
function ResponsiveExample(): JSX.Element {
  const [vertical, setVertical] = createSignal(false);

  /** Simulate a responsive orientation decision in a Solid application. */
  function toggleOrientation(): void {
    setVertical(!vertical());
  }

  return (
    <>
      <button type="button" onClick={toggleOrientation} data-testid="splitter-orientation-toggle">
        Change orientation
      </button>
      <div style={{ width: '320px', height: '240px' }}>
        <Splitter.Root
          panels={[{ id: 'a' }, { id: 'b' }]}
          defaultSize={[35, 65]}
          orientation={vertical() ? 'vertical' : 'horizontal'}
          data-testid="splitter-responsive-root"
        >
          <Splitter.Panel id="a" data-testid="splitter-responsive-a">
            A
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" data-testid="splitter-responsive-trigger" />
          <Splitter.Panel id="b" data-testid="splitter-responsive-b">
            B
          </Splitter.Panel>
        </Splitter.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Layout/Splitter Responsive',
  component: ResponsiveExample,
} satisfies Meta<typeof ResponsiveExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Orientation: Story = {};
