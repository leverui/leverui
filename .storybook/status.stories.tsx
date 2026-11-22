import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import './status-contract.css';
import { Status } from '../src/components/status-exports';
import { StatusPropsProvider } from '../src/components/status-props';

/** Apply the public indicator class to a custom native part. */
function StatusIndicatorProbe(props: { id: string }): JSX.Element {
  return <div class="leverui-status__indicator" data-testid={props.id} />;
}

/** Exercise native parts, palettes, sizes, and reactive provider defaults. */
function StatusContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Record the native root delivered through its public ref. */
  function markRoot(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Change the provider's size without remounting Status parts. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '20px', width: '420px' }}>
        <Status.Root ref={markRoot} colorPalette="red" data-testid="status-default">
          <Status.Indicator data-testid="status-indicator" />
          Pending
        </Status.Root>
        <Status.Root size="sm" colorPalette="blue" data-testid="status-small">
          <Status.Indicator data-testid="status-small-indicator" />
          Small
        </Status.Root>
        <Status.Root size="lg" colorPalette="green" data-testid="status-large">
          <Status.Indicator data-testid="status-large-indicator" />
          Large
        </Status.Root>
        <Status.Root size={{ base: 'sm', md: 'lg' }} data-testid="status-responsive">
          <Status.Indicator />
          Responsive
        </Status.Root>
        <div data-testid="status-inline-row">
          <span data-testid="status-before">Before </span>
          <Status.Root data-testid="status-inline-flow">
            <Status.Indicator />
            Inline
          </Status.Root>
          <span data-testid="status-after"> after</span>
        </div>
        <Status.Root
          class="status-contract-custom"
          title="Custom status"
          data-testid="status-custom"
        >
          <Status.Indicator data-testid="status-custom-indicator" />
          Custom
        </Status.Root>
        <Status.Root unstyled style={{ padding: '11px' }} data-testid="status-unstyled">
          <Status.Indicator data-testid="status-unstyled-indicator" />
          Unstyled
        </Status.Root>
        <StatusPropsProvider
          value={
            /** Read the current inherited size and palette in a tracked scope. */
            () => ({ size: large() ? 'lg' : 'sm', colorPalette: large() ? 'green' : 'red' })
          }
        >
          <Status.Root data-testid="status-reactive">
            <Status.Indicator data-testid="status-reactive-indicator" />
            <StatusIndicatorProbe id="status-reactive-probe" />
            Reactive
          </Status.Root>
        </StatusPropsProvider>
        <button type="button" onClick={toggleSize} data-testid="status-toggle">
          Toggle Status size
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Status',
  component: StatusContractExample,
} satisfies Meta<typeof StatusContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
