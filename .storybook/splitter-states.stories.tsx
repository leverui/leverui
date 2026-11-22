import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Splitter, useSplitter, type UseSplitterContext } from '../src';

const twoPanels = [{ id: 'a' }, { id: 'b' }];

/** Exercise a controlled size array with the primitive's resize notifications. */
function ControlledSplitterExample(): JSX.Element {
  const [sizes, setSizes] = createSignal([35, 65]);

  /** Keep the controlled prop synchronized with each machine resize. */
  function updateSizes(details: { size: number[] }): void {
    setSizes(details.size);
  }

  return (
    <>
      <output data-testid="splitter-controlled-size">{sizes()[0]?.toFixed(0)}</output>
      <Splitter.Root
        panels={twoPanels}
        size={sizes()}
        onResize={updateSizes}
        style={{ width: '320px', height: '120px' }}
      >
        <Splitter.Panel id="a" data-testid="splitter-controlled-a">
          A
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" data-testid="splitter-controlled-trigger" />
        <Splitter.Panel id="b">B</Splitter.Panel>
      </Splitter.Root>
    </>
  );
}

/** Render a reset action through the Solid Splitter context accessor. */
function renderReset(context: UseSplitterContext): JSX.Element {
  /** Restore the external store's default panel sizes. */
  function resetSizes(): void {
    context().resetSizes();
  }

  return (
    <button type="button" onClick={resetSizes} data-testid="splitter-store-reset">
      Reset
    </button>
  );
}

/** Exercise an externally owned primitive splitter store and its context API. */
function ExternalStoreBody(): JSX.Element {
  const splitter = useSplitter({ defaultSize: [45, 55], panels: twoPanels });

  /** Set panel sizes through the exported store API. */
  function setQuarter(): void {
    splitter().setSizes([25, 75]);
  }

  return (
    <>
      <button type="button" onClick={setQuarter} data-testid="splitter-store-set">
        Set quarter
      </button>
      <output data-testid="splitter-store-size">{splitter().getSizes()[0]?.toFixed(0)}</output>
      <Splitter.RootProvider value={splitter} style={{ width: '320px', height: '120px' }}>
        <Splitter.Panel id="a">A</Splitter.Panel>
        <Splitter.Context>{renderReset}</Splitter.Context>
        <Splitter.ResizeTrigger id="a:b" data-testid="splitter-store-trigger" />
        <Splitter.Panel id="b">B</Splitter.Panel>
      </Splitter.RootProvider>
    </>
  );
}

/** Mount the external store beneath the app provider. */
function ExternalStoreExample(): JSX.Element {
  return (
    <>
      <ExternalStoreBody />
    </>
  );
}

/** Exercise stacked panels with the vertical trigger orientation. */
function VerticalSplitterExample(): JSX.Element {
  return (
    <>
      <div style={{ width: '180px', height: '240px' }}>
        <Splitter.Root panels={twoPanels} defaultSize={[30, 70]} orientation="vertical">
          <Splitter.Panel id="a" data-testid="splitter-vertical-a">
            A
          </Splitter.Panel>
          <Splitter.ResizeTrigger
            id="a:b"
            aria-label="Resize vertically"
            data-testid="splitter-vertical-trigger"
          />
          <Splitter.Panel id="b" data-testid="splitter-vertical-b">
            B
          </Splitter.Panel>
        </Splitter.Root>
      </div>
    </>
  );
}

/** Exercise a disabled separator without moving either panel. */
function DisabledSplitterExample(): JSX.Element {
  return (
    <>
      <Splitter.Root
        panels={twoPanels}
        defaultSize={[50, 50]}
        style={{ width: '320px', height: '120px' }}
      >
        <Splitter.Panel id="a" data-testid="splitter-disabled-a">
          A
        </Splitter.Panel>
        <Splitter.ResizeTrigger disabled id="a:b" data-testid="splitter-disabled-trigger" />
        <Splitter.Panel id="b">B</Splitter.Panel>
      </Splitter.Root>
    </>
  );
}

const meta = {
  title: 'Layout/Splitter States',
  component: ControlledSplitterExample,
} satisfies Meta<typeof ControlledSplitterExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Controlled: Story = {};
export const ExternalStore: Story = { render: ExternalStoreExample };
export const Vertical: Story = { render: VerticalSplitterExample };
export const Disabled: Story = { render: DisabledSplitterExample };
