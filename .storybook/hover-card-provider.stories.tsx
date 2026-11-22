import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  HoverCard,
  HoverCardPropsProvider,
  Portal,
  type HoverCardOpenChangeDetails,
  useHoverCard,
} from '../src';

/** Show caller-owned state, appearance defaults, and multiple trigger values. */
function ControlledCard(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);

  /** Synchronize a requested primitive state transition with Solid state. */
  function updateOpen(details: HoverCardOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Toggle the externally controlled open state. */
  function toggleOpen(): void {
    setOpen(!open());
  }

  /** Toggle the externally controlled disabled state. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  const card = useHoverCard(
    /** Keep caller-owned state reactive inside the primitive's machine. */
    () => ({
      open: open(),
      disabled: disabled(),
      onOpenChange: updateOpen,
      openDelay: 0,
      closeDelay: 0,
    }),
  );

  return (
    <>
      <button type="button" data-testid="hover-toggle" onClick={toggleOpen}>
        Toggle card
      </button>
      <button type="button" data-testid="hover-disable" onClick={toggleDisabled}>
        Toggle disabled
      </button>
      <HoverCard.RootProvider value={card}>
        <HoverCard.Trigger value="first" as="a" href="#first" data-testid="hover-first">
          First member
        </HoverCard.Trigger>
        <HoverCard.Trigger
          value="second"
          asChild={
            /** Keep the primitive trigger attributes on a caller-owned native anchor. */
            (getProps) => (
              <a href="#second" data-testid="hover-second" {...getProps()}>
                Second member
              </a>
            )
          }
        />
        <Portal>
          <HoverCard.Positioner data-testid="hover-provider-positioner">
            <HoverCard.Content data-testid="hover-provider-content">
              <HoverCard.Arrow />
              <output data-testid="hover-trigger-value">{card().triggerValue}</output>
            </HoverCard.Content>
          </HoverCard.Positioner>
        </Portal>
      </HoverCard.RootProvider>
      <output data-testid="hover-controlled-open">{String(open())}</output>
      <output data-testid="hover-disabled-state">{String(disabled())}</output>
    </>
  );
}

/** Place provider defaults around an externally controlled Hover Card. */
function HoverCardProviderExample(): JSX.Element {
  return (
    <>
      <HoverCardPropsProvider value={{ size: 'lg', lazyMount: true, unmountOnExit: true }}>
        <ControlledCard />
      </HoverCardPropsProvider>
    </>
  );
}

const meta = {
  title: 'Components/Hover Card Provider',
  component: HoverCardProviderExample,
} satisfies Meta<typeof HoverCardProviderExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
