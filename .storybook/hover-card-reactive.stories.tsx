import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { HoverCard, HoverCardPropsProvider } from '../src';

/** Show reactive provider sizing beside an explicit instance override. */
function HoverCardReactiveExample(): JSX.Element {
  const [size, setSize] = createSignal<'sm' | 'lg'>('lg');

  /** Change provider defaults without remounting either card. */
  function toggleSize(): void {
    setSize((current) => (current === 'lg' ? 'sm' : 'lg'));
  }

  return (
    <>
      <button type="button" data-testid="hover-size-toggle" onClick={toggleSize}>
        Toggle default size
      </button>
      <HoverCardPropsProvider
        value={
          /** Track current defaults while both roots keep their machines. */
          () => ({ size: size(), lazyMount: false, unmountOnExit: false })
        }
      >
        <HoverCard.Root defaultOpen>
          <HoverCard.Trigger>Default size</HoverCard.Trigger>
          <HoverCard.Positioner>
            <HoverCard.Content data-testid="hover-default-size">Inherited size</HoverCard.Content>
          </HoverCard.Positioner>
        </HoverCard.Root>
        <HoverCard.Root size="sm" defaultOpen>
          <HoverCard.Trigger>Explicit size</HoverCard.Trigger>
          <HoverCard.Positioner>
            <HoverCard.Content data-testid="hover-explicit-size">Explicit size</HoverCard.Content>
          </HoverCard.Positioner>
        </HoverCard.Root>
      </HoverCardPropsProvider>
    </>
  );
}

const meta = {
  title: 'Components/Hover Card Reactive',
  component: HoverCardReactiveExample,
} satisfies Meta<typeof HoverCardReactiveExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
