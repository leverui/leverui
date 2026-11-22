import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ActionBar } from '../src';

type Placement = 'bottom' | 'bottom-start' | 'bottom-end';

/** Switch each documented placement while the bar remains mounted. */
function ActionBarPlacementStory(): JSX.Element {
  const [placement, setPlacement] = createSignal<Placement>('bottom');

  /** Select the start-aligned placement. */
  function moveStart(): void {
    setPlacement('bottom-start');
  }

  /** Select the centered placement. */
  function moveCenter(): void {
    setPlacement('bottom');
  }

  /** Select the end-aligned placement. */
  function moveEnd(): void {
    setPlacement('bottom-end');
  }

  return (
    <>
      <div style={{ padding: '32px', 'min-height': '420px' }}>
        <button type="button" onClick={moveStart}>
          Start
        </button>
        <button type="button" onClick={moveCenter}>
          Center
        </button>
        <button type="button" onClick={moveEnd}>
          End
        </button>
        <output data-testid="action-bar-placement">{placement()}</output>
        <ActionBar.Root open placement={placement()}>
          <ActionBar.Positioner data-testid="action-bar-positioner">
            <ActionBar.Content aria-label="Placed actions">
              <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <button type="button">Move</button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </ActionBar.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Action Bar Placement',
  component: ActionBarPlacementStory,
} satisfies Meta<typeof ActionBarPlacementStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = { render: ActionBarPlacementStory };

/** Follow the same responsive placement choice on both sides of a breakpoint. */
function ResponsiveActionBarStory(): JSX.Element {
  return (
    <>
      <div style={{ padding: '32px', 'min-height': '420px' }}>
        <ActionBar.Root open placement={{ base: 'bottom-start', md: 'bottom-end' }}>
          <ActionBar.Positioner data-testid="responsive-action-bar-positioner">
            <ActionBar.Content aria-label="Responsive actions">
              <ActionBar.SelectionTrigger>3 selected</ActionBar.SelectionTrigger>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </ActionBar.Root>
      </div>
    </>
  );
}

export const Responsive: Story = { render: ResponsiveActionBarStory };
