import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  TooltipContent,
  TooltipPositioner,
  TooltipPropsProvider,
  TooltipRoot,
  TooltipRootProvider,
  TooltipTrigger,
  type TooltipOpenChangeDetails,
  useTooltip,
} from '../src';

/** Keep a disabled machine from exposing its tooltip. */
function DisabledTooltip(): JSX.Element {
  return (
    <>
      <TooltipRoot disabled openDelay={0}>
        <TooltipTrigger data-testid="disabled-tooltip-trigger">Disabled help</TooltipTrigger>
        <TooltipPositioner>
          <TooltipContent data-testid="disabled-tooltip-content">Disabled details</TooltipContent>
        </TooltipPositioner>
      </TooltipRoot>
    </>
  );
}

/** Retain the primitive's configurable Escape dismissal behavior. */
function EscapePersistentTooltip(): JSX.Element {
  return (
    <>
      <TooltipRoot openDelay={0} closeDelay={0} closeOnEscape={false}>
        <TooltipTrigger data-testid="escape-tooltip-trigger">Persistent help</TooltipTrigger>
        <TooltipPositioner>
          <TooltipContent data-testid="escape-tooltip-content">Persistent details</TooltipContent>
        </TooltipPositioner>
      </TooltipRoot>
    </>
  );
}

/** Exercise a caller-owned machine and inherited presence defaults. */
function ProviderTooltip(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Synchronize caller-owned state with the primitive's state machine. */
  function updateOpen(details: TooltipOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Read current controlled state for the caller-owned Tooltip machine. */
  function readTooltipProps() {
    return { open: open(), onOpenChange: updateOpen };
  }

  /** Toggle the caller-owned Tooltip state from its external control. */
  function toggleOpen(): void {
    setOpen(!open());
  }

  const tooltip = useTooltip(readTooltipProps);

  return (
    <TooltipPropsProvider value={{ lazyMount: false }}>
      <TooltipRootProvider value={tooltip}>
        <TooltipTrigger data-testid="provider-tooltip-trigger">Provider help</TooltipTrigger>
        <TooltipPositioner>
          <TooltipContent data-testid="provider-tooltip-content">Provider details</TooltipContent>
        </TooltipPositioner>
      </TooltipRootProvider>
      <button type="button" data-testid="provider-tooltip-toggle" onClick={toggleOpen}>
        Toggle provider
      </button>
    </TooltipPropsProvider>
  );
}

/** Place the machine beneath the system and locale context. */
function ProviderStory(): JSX.Element {
  return (
    <>
      <ProviderTooltip />
    </>
  );
}

const meta = {
  title: 'Components/Tooltip Options',
  component: DisabledTooltip,
} satisfies Meta<typeof DisabledTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Disabled: Story = {};
export const EscapePersistent: Story = { render: EscapePersistentTooltip };
export const Provider: Story = { render: ProviderStory };
