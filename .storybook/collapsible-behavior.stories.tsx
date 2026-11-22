import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Collapsible, type CollapsibleOpenChangeDetails } from '../src';

/** Close the nearest Collapsible through its public context accessor. */
function ContextCloseButton(): JSX.Element {
  const api = Collapsible.useCollapsibleContext();

  /** Ask the nearest primitive machine to close. */
  function close(): void {
    api().setOpen(false);
  }

  return (
    <button type="button" onClick={close}>
      Close from context
    </button>
  );
}

/** Exercise externally controlled state and programmatic context closure. */
function ControlledCollapsibleStory(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  /** Mirror the primitive's requested state change into the external signal. */
  function changeOpen(details: CollapsibleOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Open the controlled disclosure from outside its trigger. */
  function openExternally(): void {
    setOpen(true);
  }

  return (
    <>
      <button type="button" onClick={openExternally}>
        Open externally
      </button>
      <output data-testid="collapsible-controlled-state">{open() ? 'open' : 'closed'}</output>
      <Collapsible.Root open={open()} onOpenChange={changeOpen}>
        <Collapsible.Trigger>Toggle controlled</Collapsible.Trigger>
        <Collapsible.Content data-testid="collapsible-controlled-content">
          Controlled details
          <ContextCloseButton />
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

const meta = {
  title: 'Components/Collapsible Behavior',
  component: ControlledCollapsibleStory,
} satisfies Meta<typeof ControlledCollapsibleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = { render: ControlledCollapsibleStory };

/** Keep an external primitive machine authoritative under RootProvider. */
function CallerOwnedCollapsibleStory(): JSX.Element {
  const machine = Collapsible.useCollapsible({ defaultOpen: true });

  /** Toggle the external machine from outside its styled root. */
  function toggleMachine(): void {
    machine().setOpen(!machine().open);
  }

  return (
    <>
      <button type="button" onClick={toggleMachine}>
        Toggle external machine
      </button>
      <output data-testid="collapsible-external-state">{machine().open ? 'open' : 'closed'}</output>
      <Collapsible.RootProvider value={machine} data-testid="collapsible-external-root">
        <Collapsible.Trigger>External trigger</Collapsible.Trigger>
        <Collapsible.Content data-testid="collapsible-external-content">
          External machine details
        </Collapsible.Content>
      </Collapsible.RootProvider>
    </>
  );
}

export const CallerOwned: Story = { render: CallerOwnedCollapsibleStory };

/** Preserve the primitive behavior across caller-owned native part renderers. */
function ChildRendererCollapsibleStory(): JSX.Element {
  /** Record the selected root element for the browser check. */
  function captureRoot(element: Element): void {
    element.setAttribute('data-caller-ref', 'attached');
  }

  return (
    <>
      <Collapsible.Root
        ref={captureRoot}
        asChild={
          /** Render the primitive's root attributes on a caller-owned section. */
          (getProps) => <section {...getProps()} data-testid="collapsible-child-root" />
        }
      >
        <Collapsible.Trigger
          asChild={
            /** Keep the machine click handler on a caller-owned button. */
            (getProps) => <button {...getProps()} data-testid="collapsible-child-trigger" />
          }
        >
          Toggle child parts
          <Collapsible.Indicator
            asChild={
              /** Render the current state on a caller-owned span. */
              (getProps) => <span {...getProps()} data-testid="collapsible-child-indicator" />
            }
          >
            ›
          </Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content
          asChild={
            /** Keep visibility and style attributes on a caller-owned article. */
            (getProps) => <article {...getProps()} data-testid="collapsible-child-content" />
          }
        >
          Caller-owned details
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

export const ChildRenderers: Story = { render: ChildRendererCollapsibleStory };

/** Exercise the presentation-free path without changing the primitive disclosure. */
function UnstyledCollapsibleStory(): JSX.Element {
  return (
    <>
      <Collapsible.Root unstyled defaultOpen data-testid="collapsible-unstyled-root">
        <Collapsible.Trigger>Toggle unstyled details</Collapsible.Trigger>
        <Collapsible.Content data-testid="collapsible-unstyled-content">
          Unstyled details
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
}

export const Unstyled: Story = { render: UnstyledCollapsibleStory };
