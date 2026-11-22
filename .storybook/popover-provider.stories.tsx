import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Popover, PopoverPropsProvider, type PopoverOpenChangeDetails, usePopover } from '../src';

/** Exercise an external primitive accessor and reactive CSS size defaults. */
function ControlledPopover(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('lg');
  const [enterCount, setEnterCount] = createSignal(0);

  /** Synchronize requested open state with the caller's signal. */
  function updateOpen(details: PopoverOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Open the externally controlled machine. */
  function openPopover(): void {
    setOpen(true);
  }

  /** Close the externally controlled machine. */
  function closePopover(): void {
    setOpen(false);
  }

  /** Change the inherited size while content stays mounted. */
  function toggleSize(): void {
    setSize(
      /** Alternate between both sizes without recreating the root. */
      (current) => (current === 'lg' ? 'sm' : 'lg'),
    );
  }

  /** Count the primitive presence completion callbacks inherited through the provider. */
  function countEnter(): void {
    setEnterCount(
      /** Increment from the latest count when an animation completes. */
      (current) => current + 1,
    );
  }

  const popover = usePopover(
    /** Track the caller's controlled state in the primitive's machine. */
    () => ({ open: open(), onOpenChange: updateOpen }),
  );

  return (
    <>
      <button type="button" data-testid="popover-provider-open" onClick={openPopover}>
        Open Popover
      </button>
      <button type="button" data-testid="popover-provider-close" onClick={closePopover}>
        Close Popover
      </button>
      <PopoverPropsProvider
        value={
          /** Follow provider defaults without replacing external state. */
          () => ({
            size: size(),
            immediate: true,
            present: true,
            onEnterComplete: countEnter,
          })
        }
      >
        <Popover.RootProvider value={popover}>
          <Popover.Trigger value="first" data-testid="popover-first-trigger">
            First trigger
          </Popover.Trigger>
          <Popover.Trigger
            value="second"
            asChild={
              /** Keep the primitive behavior on a caller-owned trigger element. */
              (getProps) => (
                <button type="button" data-testid="popover-second-trigger" {...getProps()}>
                  Second trigger
                </button>
              )
            }
          />
          <Popover.Positioner>
            <Popover.Content data-testid="popover-provider-content">
              <Popover.Body data-testid="popover-provider-body">
                <output data-testid="popover-trigger-value">{popover().triggerValue}</output>
                <button type="button" data-testid="popover-size-toggle" onClick={toggleSize}>
                  Toggle size
                </button>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.RootProvider>
        <Popover.Root size="xs">
          <Popover.Trigger data-testid="popover-fixed-trigger">Fixed size Popover</Popover.Trigger>
          <Popover.Positioner>
            <Popover.Content data-testid="popover-fixed-content">
              <Popover.Body data-testid="popover-fixed-body">Fixed size</Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      </PopoverPropsProvider>
      <output data-testid="popover-controlled-open">{String(open())}</output>
      <output data-testid="popover-machine-open">{String(popover().open)}</output>
      <output data-testid="popover-enter-count">{enterCount()}</output>
    </>
  );
}

const meta = {
  title: 'Components/Popover Provider',
  component: ControlledPopover,
} satisfies Meta<typeof ControlledPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
