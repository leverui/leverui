import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadialBarChart, RadialChart } from '../src';
import './radial-css-contract.css';

const pieData = [
  { name: 'Windows', value: 40, color: 'blue.solid' },
  { name: 'Mac', value: 35, color: 'orange.solid' },
  { name: 'Linux', value: 25, color: 'pink.solid' },
];

const barData = [
  { name: 'January', value: 165, color: 'teal.solid' },
  { name: 'February', value: 190, color: 'purple.solid' },
];

/** Exercise radial CSS overrides and live geometry on the published parts. */
function RadialCssContract(): JSX.Element {
  const [size, setSize] = createSignal(200);
  const [placement, setPlacement] = createSignal<'inside' | 'point'>('inside');
  const [stroke, setStroke] = createSignal<string>();
  /** Change numeric geometry without replacing either chart root. */
  function resize(): void {
    setSize(240);
  }
  /** Select the point label treatment through a finite attribute. */
  function showPointLabels(): void {
    setPlacement('point');
  }
  /** Confirm an explicit prop still overrides the theme-level stroke. */
  function useLocalStroke(): void {
    setStroke('rgb(180, 30, 60)');
  }
  return (
    <>
      <button data-testid="radial-resize" onClick={resize}>
        Resize charts
      </button>
      <button data-testid="radial-point-labels" onClick={showPointLabels}>
        Point labels
      </button>
      <button data-testid="radial-local-stroke" onClick={useLocalStroke}>
        Local stroke
      </button>
      <RadialChart
        id="radial-native-root"
        title="Operating system share"
        data-consumer="pie"
        data={pieData}
        size={size()}
        innerRadius={50}
        label={placement()}
        legend
        centerTitle="100"
        centerDescription="total"
        tooltip
        stroke={stroke()}
        class="radial-consumer"
        aria-label="Operating system share"
        onClick={
          /** Keep consumer native click handlers on the chart root. */ (event) => {
            event.currentTarget.dataset.clicked = 'true';
          }
        }
      />
      <RadialBarChart
        id="radial-bar-native-root"
        title="Monthly totals"
        data-consumer="rings"
        data={barData}
        size={size() + 120}
        label
        legend
        class="radial-bar-consumer"
        aria-label="Monthly totals"
        onKeyDown={
          /** Keep consumer keyboard handlers alongside chart navigation. */ (event) => {
            event.currentTarget.dataset.key = event.key;
          }
        }
      />
    </>
  );
}

/** Expose native keyboard behavior when chart tooltip navigation is disabled. */
function PassiveRadialContract(): JSX.Element {
  return (
    <RadialBarChart
      data={barData}
      tooltip={false}
      tabindex="0"
      role="region"
      aria-label="Passive rings"
      onKeyDown={
        /** Record the native Arrow key's prevention state. */ (event) => {
          event.currentTarget.dataset.prevented = String(event.defaultPrevented);
        }
      }
    />
  );
}

/** Exercise CSS scaling independently of a chart's numeric SVG viewBox. */
function ResponsiveRadialContract(): JSX.Element {
  const [width, setWidth] = createSignal(150);
  const [size, setSize] = createSignal(400);
  /** Resize the container while its SVG tooltip remains active. */
  function widen(): void {
    setWidth(300);
  }
  /** Change viewBox units while the same tooltip stays visible. */
  function grow(): void {
    setSize(500);
  }
  return (
    <>
      <button data-testid="radial-widen" onClick={widen}>
        Widen
      </button>
      <button data-testid="radial-grow" onClick={grow}>
        Grow
      </button>
      <div style={{ width: `${width()}px` }}>
        <RadialChart data={pieData} size={size()} tooltip aria-label="Narrow pie" />
      </div>
    </>
  );
}

const meta = {
  title: 'Internal/Charts/Radial CSS',
  component: RadialCssContract,
} satisfies Meta<typeof RadialCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
export const Passive: Story = { render: PassiveRadialContract };
export const Responsive: Story = { render: ResponsiveRadialContract };
