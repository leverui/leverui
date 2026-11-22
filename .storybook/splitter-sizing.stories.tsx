import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter } from '../src';

/** Exercise CSS-unit initial sizes and pixel-based constraints. */
function CssUnitsExample(): JSX.Element {
  return (
    <>
      <div style={{ width: '600px', height: '120px' }}>
        <Splitter.Root
          panels={[
            { id: 'nav', minSize: '120px', maxSize: '250px' },
            { id: 'main', minSize: 30 },
          ]}
          defaultSize={['180px', 70]}
        >
          <Splitter.Panel id="nav" data-testid="splitter-css-nav">
            Nav
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="nav:main" data-testid="splitter-css-trigger" />
          <Splitter.Panel id="main">Main</Splitter.Panel>
        </Splitter.Root>
      </div>
    </>
  );
}

/** Keep a panel's width when its parent group grows. */
function PreservePixelsExample(): JSX.Element {
  const [width, setWidth] = createSignal(500);

  /** Grow the measured parent without changing panel definitions. */
  function growParent(): void {
    setWidth(600);
  }

  return (
    <>
      <button type="button" onClick={growParent} data-testid="splitter-grow-parent">
        Grow parent
      </button>
      <div
        data-testid="splitter-resizable-parent"
        style={{ width: `${width()}px`, height: '120px' }}
      >
        <Splitter.Root
          panels={[{ id: 'fixed', resizeBehavior: 'preserve-pixel-size' }, { id: 'flex' }]}
          defaultSize={[40, 60]}
        >
          <Splitter.Panel id="fixed" data-testid="splitter-fixed-panel">
            Fixed
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="fixed:flex" data-testid="splitter-fixed-trigger" />
          <Splitter.Panel id="flex">Flexible</Splitter.Panel>
        </Splitter.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Layout/Splitter Sizing',
  component: CssUnitsExample,
} satisfies Meta<typeof CssUnitsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CssUnits: Story = {};
export const PreservePixels: Story = { render: PreservePixelsExample };
