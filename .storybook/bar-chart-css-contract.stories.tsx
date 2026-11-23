import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { BarChart } from '../src';

const data = [
  { month: 'January', value: 20 },
  { month: 'February', value: 32 },
];

/** Expose authored chart paint, inherited variables, and reactive root state. */
function BarChartCssContract(): JSX.Element {
  const [side, setSide] = createSignal(false);
  const [unstyled, setUnstyled] = createSignal(false);

  /** Move the legend between its two placements. */
  function togglePlacement(): void {
    setSide(!side());
  }

  /** Suppress authored chart presentation without replacing its SVG. */
  function toggleUnstyled(): void {
    setUnstyled(!unstyled());
  }

  /** Expose the native root received through the public ref. */
  function markRoot(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <button type="button" data-testid="bar-placement-toggle" onClick={togglePlacement}>
        Toggle legend placement
      </button>
      <button type="button" data-testid="bar-unstyled-toggle" onClick={toggleUnstyled}>
        Toggle unstyled
      </button>
      <div
        data-testid="bar-chart-contract"
        style={{
          '--lui-bar-chart-axis-font-size': '17px',
          '--lui-bar-chart-grid-color': 'rgb(255, 0, 0)',
        }}
      >
        <BarChart
          id="bar-chart-native"
          title="Chart actions"
          data-consumer="present"
          data={data}
          xKey="month"
          series={[{ name: 'value', color: 'teal.solid', label: true }]}
          showLegend
          tooltip
          legendPlacement={side() ? 'top-right' : 'bottom'}
          unstyled={unstyled()}
          class="consumer-bars"
          className="consumer-bars-alias"
          style={{ width: side() ? '480px' : '360px' }}
          ref={markRoot}
          aria-label="Contract bars"
          onFocus={
            /** Keep a caller's native focus handler beside chart navigation. */
            (event) => {
              event.currentTarget.dataset.consumerFocus = 'true';
            }
          }
          onKeyDown={
            /** Keep a caller's native key handler beside chart navigation. */
            (event) => {
              event.currentTarget.dataset.consumerKey = event.key;
            }
          }
        />
      </div>
    </>
  );
}

const meta = {
  title: 'Internal/Bar Chart CSS Contract',
  component: BarChartCssContract,
} satisfies Meta<typeof BarChartCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: BarChartCssContract };
