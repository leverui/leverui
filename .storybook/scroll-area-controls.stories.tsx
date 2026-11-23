import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ScrollArea, useScrollArea, useScrollAreaContext } from '../src';
import './scroll-area-controls.css';

const rows = Array.from(
  { length: 30 },
  /** Fill the viewport with predictable programmatic scroll targets. */
  (_, index) => `Programmatic row ${index + 1}`,
);

/** Show the machine state from the nearest root. */
function ScrollAreaState(): JSX.Element {
  const area = useScrollAreaContext();
  return <output data-testid="scroll-state">{area().isAtBottom ? 'bottom' : 'away'}</output>;
}

/** Drive the primitive's scroll methods through an external accessor. */
function ProgrammaticArea(): JSX.Element {
  const area = useScrollArea();

  /** Move the viewport to its lower edge. */
  function scrollToBottom(): void {
    area().scrollToEdge({ edge: 'bottom', behavior: 'auto' });
  }

  /** Move the viewport to an exact vertical position. */
  function scrollToPosition(): void {
    area().scrollTo({ top: 80, behavior: 'auto' });
  }

  /** Return the viewport to its upper edge. */
  function scrollToTop(): void {
    area().scrollToEdge({ edge: 'top', behavior: 'auto' });
  }

  return (
    <>
      <button type="button" onClick={scrollToBottom}>
        Scroll to bottom
      </button>
      <button type="button" onClick={scrollToPosition}>
        Scroll to 80
      </button>
      <button type="button" onClick={scrollToTop}>
        Scroll to top
      </button>
      <ScrollArea.RootProvider
        value={area}
        style={{ height: '9rem', width: '20rem' }}
        variant="always"
      >
        <ScrollArea.Viewport data-testid="controlled-viewport">
          <ScrollArea.Content>
            <For each={rows}>
              {/** Preserve row identities while the machine scrolls. */}
              {(row) => <p>{row}</p>}
            </For>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
        <ScrollAreaState />
      </ScrollArea.RootProvider>
    </>
  );
}

const meta = {
  title: 'Components/Scroll Area Controls',
  component: ProgrammaticArea,
} satisfies Meta<typeof ProgrammaticArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Programmatic: Story = { render: ProgrammaticArea };

/** Keep inherited appearance defaults reactive without replacing the root. */
function DefaultsArea(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Enlarge the inherited scrollbar size. */
  function enlarge(): void {
    setLarge(true);
  }

  return (
    <>
      <button type="button" onClick={enlarge}>
        Enlarge inherited scrollbar
      </button>
      <ScrollArea.PropsProvider
        value={
          /** Track changing presentation defaults for the descendant root. */
          () => ({ size: large() ? 'lg' : 'xs', variant: 'always' })
        }
      >
        <ScrollArea.Root style={{ height: '9rem', width: '20rem' }} data-testid="defaulted-root">
          <ScrollArea.Viewport data-testid="defaulted-viewport">
            <ScrollArea.Content>
              <For each={rows}>
                {/** Keep the machine content stable while defaults change. */}
                {(row) => <p>{row}</p>}
              </For>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </ScrollArea.PropsProvider>
    </>
  );
}

export const Defaults: Story = { render: DefaultsArea };

/** Apply consumer CSS to the viewport and a caller-owned thumb. */
function CustomStylesArea(): JSX.Element {
  return (
    <>
      <ScrollArea.Root style={{ height: '9rem', width: '20rem' }} variant="always">
        <ScrollArea.Viewport data-testid="shadow-viewport" class="custom-scroll-shadow">
          <ScrollArea.Content>
            <For each={rows}>
              {/** Give the shadow enough vertical content to respond to overflow. */}
              {(row) => <p>{row}</p>}
            </For>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar style={{ '--lui-scroll-area-track-color': '#fee2e2' }}>
          <ScrollArea.Thumb data-testid="custom-thumb" style={{ background: '#dc2626' }} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </>
  );
}

export const CustomStyles: Story = { render: CustomStylesArea };
