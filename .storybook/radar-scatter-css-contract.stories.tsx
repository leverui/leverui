import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadarChart, ScatterChart } from '../src';

const radarData = [
  { label: 'January', value: 20 },
  { label: 'February', value: 40 },
  { label: 'March', value: 30 },
] as const;
const scatterData = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 3 },
] as const;

/** Exercise authored chart CSS, native props, and reactive dimensions. */
function RadarScatterCssContract(): JSX.Element {
  const [compact, setCompact] = createSignal(false);
  const [tooltips, setTooltips] = createSignal(true);

  /** Update both chart sizes without remounting their roots. */
  function toggleSize(): void {
    setCompact(!compact());
  }

  /** Toggle chart navigation while retaining native keyboard handlers. */
  function toggleTooltips(): void {
    setTooltips(!tooltips());
  }

  /** Mark the radar root supplied through its native ref. */
  function markRadar(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Mark the measured scatter root supplied through its native ref. */
  function markScatter(element: HTMLDivElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <button type="button" data-testid="chart-size-toggle" onClick={toggleSize}>
        Toggle chart sizes
      </button>
      <button type="button" data-testid="chart-tooltip-toggle" onClick={toggleTooltips}>
        Toggle tooltips
      </button>
      <RadarChart
        data={radarData}
        series={[{ name: 'value', color: 'teal.solid' }]}
        width={compact() ? 320 : 384}
        grid="filled"
        legend
        tooltip={tooltips()}
        tabindex="0"
        id="consumer-radar-root"
        title="Radar native title"
        class="consumer-radar"
        className="consumer-radar-alias"
        style={{ 'margin-left': '13px' }}
        ref={markRadar}
        onFocus={
          /** Record native focus delivery alongside chart keyboard navigation. */
          (event) => {
            event.currentTarget.dataset.nativeFocus = 'true';
          }
        }
        onKeyDown={
          /** Record the caller's native keyboard event after chart handling. */
          (event) => {
            event.currentTarget.dataset.nativeKey = event.key;
            event.currentTarget.dataset.defaultPrevented = String(event.defaultPrevented);
          }
        }
      />
      <ScatterChart
        data={scatterData}
        xKey="x"
        yKey="y"
        series={[{ name: 'value', color: 'teal.solid' }]}
        height={compact() ? 300 : 384}
        trendLine
        showLegend
        tooltip={tooltips()}
        tabindex="0"
        id="consumer-scatter-root"
        title="Scatter native title"
        class="consumer-scatter"
        style={{ 'margin-left': '17px' }}
        ref={markScatter}
        onFocus={
          /** Record native focus delivery on the measured scatter root. */
          (event) => {
            event.currentTarget.dataset.nativeFocus = 'true';
          }
        }
        onKeyDown={
          /** Record native keyboard delivery after point navigation. */
          (event) => {
            event.currentTarget.dataset.nativeKey = event.key;
            event.currentTarget.dataset.defaultPrevented = String(event.defaultPrevented);
          }
        }
      />
    </>
  );
}

const meta = {
  title: 'Internal/Radar and Scatter CSS Contract',
  component: RadarScatterCssContract,
} satisfies Meta<typeof RadarScatterCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: RadarScatterCssContract };
