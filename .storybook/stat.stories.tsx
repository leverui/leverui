import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Stat } from '../src/components/stat-exports';
import { StatGroup } from '../src/components/stat-group';
import { StatPropsProvider, type StatRootBaseProps } from '../src/components/stat-props';

/** Use the public Stat part class on a custom native value. */
function StatValueProbe(props: { id: string }): JSX.Element {
  return (
    <dd class="lui-stat__valueText" data-testid={props.id}>
      Custom value
    </dd>
  );
}

/** Exercise semantic parts, sizes, indicators, groups, and live defaults. */
function StatContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Mark the native description list received through its public ref. */
  function markRoot(element: HTMLDListElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Switch shared size variants without remounting a root. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Supply current size defaults to the reactive Stat root. */
  function readSharedSize(): StatRootBaseProps {
    return { size: large() ? 'lg' : 'sm' };
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '24px', width: '520px' }}>
        <Stat.Root ref={markRoot} data-testid="stat-default">
          <Stat.Label data-testid="stat-label">Unique visitors</Stat.Label>
          <Stat.ValueText data-testid="stat-value">192.1k</Stat.ValueText>
          <Stat.HelpText data-testid="stat-help">
            <Stat.UpIndicator data-testid="stat-up" />
            23.36%
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root size="sm" data-testid="stat-small">
          <Stat.Label>Time to complete</Stat.Label>
          <Stat.ValueText data-testid="stat-small-value">
            3 <Stat.ValueUnit data-testid="stat-unit">hr</Stat.ValueUnit>
          </Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator data-testid="stat-down" />
            9.05%
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root size="lg" data-testid="stat-large">
          <Stat.Label>Sales</Stat.Label>
          <Stat.ValueText data-testid="stat-large-value">$42,000</Stat.ValueText>
        </Stat.Root>
        <Stat.Root size={{ base: 'sm', md: 'lg' }} data-testid="stat-responsive">
          <Stat.Label>Responsive value</Stat.Label>
          <Stat.ValueText data-testid="stat-responsive-value">72</Stat.ValueText>
        </Stat.Root>
        <StatGroup size="lg" data-testid="stat-group">
          <Stat.Root data-testid="stat-group-first">
            <Stat.Label>Sent</Stat.Label>
            <Stat.ValueText data-testid="stat-group-value">345,670</Stat.ValueText>
          </Stat.Root>
          <Stat.Root size="sm" data-testid="stat-group-second">
            <Stat.Label>Clicked</Stat.Label>
            <Stat.ValueText data-testid="stat-group-fixed">45</Stat.ValueText>
            <StatValueProbe id="stat-fixed-probe" />
          </Stat.Root>
        </StatGroup>
        <StatPropsProvider value={readSharedSize}>
          <Stat.Root data-testid="stat-inherited">
            <Stat.Label>Reactive</Stat.Label>
            <Stat.ValueText data-testid="stat-reactive-value">12</Stat.ValueText>
            <StatValueProbe id="stat-reactive-probe" />
          </Stat.Root>
        </StatPropsProvider>
        <button type="button" onClick={toggleSize} data-testid="stat-size-toggle">
          Toggle Stat size
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Stat',
  component: StatContractExample,
} satisfies Meta<typeof StatContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
