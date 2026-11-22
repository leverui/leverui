import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter, createSplitterRegistry, useSplitterContext } from '../src';

/** Exercise two handles and per-panel minimum and maximum sizes. */
function MultiPanelExample(): JSX.Element {
  return (
    <>
      <div style={{ width: '360px', height: '120px' }}>
        <Splitter.Root
          panels={[
            { id: 'a', minSize: 20, maxSize: 40 },
            { id: 'b', minSize: 30 },
            { id: 'c', minSize: 20 },
          ]}
          defaultSize={[30, 40, 30]}
        >
          <Splitter.Panel id="a" data-testid="splitter-multi-a">
            A
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" data-testid="splitter-multi-first" />
          <Splitter.Panel id="b" data-testid="splitter-multi-b">
            B
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="b:c" data-testid="splitter-multi-second" />
          <Splitter.Panel id="c" data-testid="splitter-multi-c">
            C
          </Splitter.Panel>
        </Splitter.Root>
      </div>
    </>
  );
}

/** Expose the nearest machine's collapse and expansion actions. */
function CollapseControls(): JSX.Element {
  const splitter = useSplitterContext();

  /** Collapse the first panel to its configured snapped size. */
  function collapse(): void {
    splitter().collapsePanel('a');
  }

  /** Restore the first panel to its minimum expanded size. */
  function expand(): void {
    splitter().expandPanel('a');
  }

  return (
    <>
      <button type="button" onClick={collapse} data-testid="splitter-collapse-action">
        Collapse
      </button>
      <button type="button" onClick={expand} data-testid="splitter-expand-action">
        Expand
      </button>
    </>
  );
}

/** Exercise collapse and expansion through Zag's machine API. */
function CollapsibleExample(): JSX.Element {
  const [collapses, setCollapses] = createSignal(0);
  const [expands, setExpands] = createSignal(0);

  /** Count machine collapse events for the first panel. */
  function recordCollapse(): void {
    setCollapses(
      /** Advance the collapse notification count. */
      (count) => count + 1,
    );
  }

  /** Count machine expansion events for the first panel. */
  function recordExpand(): void {
    setExpands(
      /** Advance the expansion notification count. */
      (count) => count + 1,
    );
  }

  return (
    <>
      <output data-testid="splitter-collapse-count">{collapses()}</output>
      <output data-testid="splitter-expand-count">{expands()}</output>
      <div style={{ width: '360px', height: '120px' }}>
        <Splitter.Root
          panels={[
            { id: 'a', collapsible: true, collapsedSize: 5, minSize: 25 },
            { id: 'b', minSize: 50 },
          ]}
          defaultSize={[40, 60]}
          onCollapse={recordCollapse}
          onExpand={recordExpand}
        >
          <Splitter.Panel id="a" data-testid="splitter-collapse-a">
            A
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" data-testid="splitter-collapse-trigger" />
          <Splitter.Panel id="b">
            <CollapseControls />
          </Splitter.Panel>
        </Splitter.Root>
      </div>
    </>
  );
}

const registry = createSplitterRegistry();

/** Exercise independent nested machines registered under one registry. */
function NestedExample(): JSX.Element {
  return (
    <>
      <div style={{ width: '400px', height: '240px' }}>
        <Splitter.Root panels={[{ id: 'left' }, { id: 'right' }]} registry={registry}>
          <Splitter.Panel id="left" data-testid="splitter-nested-left">
            Left
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="left:right" data-testid="splitter-nested-outer" />
          <Splitter.Panel id="right" data-testid="splitter-nested-right">
            <Splitter.Root
              orientation="vertical"
              panels={[{ id: 'top' }, { id: 'bottom' }]}
              registry={registry}
            >
              <Splitter.Panel id="top" data-testid="splitter-nested-top">
                Top
              </Splitter.Panel>
              <Splitter.ResizeTrigger id="top:bottom" data-testid="splitter-nested-inner" />
              <Splitter.Panel id="bottom" data-testid="splitter-nested-bottom">
                Bottom
              </Splitter.Panel>
            </Splitter.Root>
          </Splitter.Panel>
        </Splitter.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Layout/Splitter Advanced',
  component: MultiPanelExample,
} satisfies Meta<typeof MultiPanelExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MultiPanel: Story = {};
export const Collapsible: Story = { render: CollapsibleExample };
export const Nested: Story = { render: NestedExample };
