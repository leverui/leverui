import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { AreaChart, LineChart } from '../src';
import './cartesian-css.css';

/** Exercise authored Area Chart styling and native chart root props. */
function AreaCssContract(): JSX.Element {
  const [visits, setVisits] = createSignal(30);
  const [visible, setVisible] = createSignal(3);
  /** Change the rendered area path without remounting the chart. */
  function update(): void {
    setVisits(70);
  }
  /** Shrink the data while a keyboard category is still active. */
  function shrink(): void {
    setVisible(1);
  }
  return (
    <>
      <button type="button" data-testid="area-data-toggle" onClick={update}>
        Update visits
      </button>
      <button type="button" data-testid="area-data-shrink" onClick={shrink}>
        Shrink data
      </button>
      <AreaChart
        id="cartesian-area-root"
        aria-label="Monthly visits"
        class="consumer-area-chart"
        style={{ width: '420px' }}
        ref={
          /** Mark the consumer's forwarded native root ref. */
          (element) => {
            element.dataset.ref = 'bound';
          }
        }
        onFocus={
          /** Observe the consumer focus handler alongside chart navigation. */
          (event) => {
            event.currentTarget.dataset.focused = 'true';
          }
        }
        data={[
          { month: 'Jan', visits: 50 },
          { month: 'Feb', visits: visits() },
          { month: 'Mar', visits: 60 },
        ].slice(0, visible())}
        xKey="month"
        series={[{ name: 'visits', color: 'teal.solid' }]}
        height={260}
        showGrid
        gridDashed
        showYAxis
        showLegend
        legendPlacement="top-right"
        referenceLines={[{ x: 'Feb', label: 'Target' }]}
      />
    </>
  );
}

/** Exercise authored Line Chart labels, legend, and focus tooltip. */
function LineCssContract(): JSX.Element {
  return (
    <LineChart
      id="cartesian-line-root"
      aria-label="Monthly revenue"
      class="consumer-line-chart"
      data={[
        { month: 'Jan', sales: 10, budget: 25 },
        { month: 'Feb', sales: 40, budget: 35 },
        { month: 'Mar', sales: 25, budget: 30 },
      ]}
      xKey="month"
      series={[
        { name: 'sales', color: 'blue.solid', strokeWidth: 3 },
        { name: 'budget', color: 'teal.solid' },
      ]}
      height={260}
      dots
      pointLabels
      pointLabelPosition="right"
      showLegend
      legendInteraction="hover"
      showYAxis
    />
  );
}

/** Keep native keyboard events usable when chart tooltips are disabled. */
function PassiveLineCssContract(): JSX.Element {
  return (
    <LineChart
      id="cartesian-passive-root"
      data={[
        { month: 'Jan', sales: 10 },
        { month: 'Feb', sales: 40 },
      ]}
      xKey="month"
      series={[{ name: 'sales', color: 'blue.solid' }]}
      tooltip={false}
      tabindex="0"
      onKeyDown={
        /** Record that consumer keyboard handling remains unprevented. */
        (event) => {
          event.currentTarget.dataset.keydown = event.key;
          event.currentTarget.dataset.prevented = String(event.defaultPrevented);
        }
      }
    />
  );
}

/** Compare responsive defaults with an explicit fixed chart height. */
function ResponsiveCssContract(): JSX.Element {
  const [wide, setWide] = createSignal(false);
  /** Resize the same chart roots without remounting their SVGs. */
  function expand(): void {
    setWide(true);
  }
  const data = [
    { month: 'Jan', sales: 10 },
    { month: 'Feb', sales: 40 },
  ];
  const series = [{ name: 'sales', color: 'teal.solid' }];
  return (
    <>
      <button type="button" data-testid="cartesian-width-toggle" onClick={expand}>
        Expand charts
      </button>
      <div style={{ width: wide() ? '600px' : '280px' }}>
        <AreaChart id="responsive-area" data={data} xKey="month" series={series} showLegend />
        <LineChart id="responsive-line" data={data} xKey="month" series={series} maxHeight={448} />
        <LineChart id="fixed-line" data={data} xKey="month" series={series} height={260} />
      </div>
    </>
  );
}

const meta = {
  title: 'Internal/Cartesian CSS',
  component: AreaCssContract,
} satisfies Meta<typeof AreaCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Area: Story = { render: AreaCssContract };
export const Line: Story = { render: LineCssContract };
export const Passive: Story = { render: PassiveLineCssContract };
export const Responsive: Story = { render: ResponsiveCssContract };
