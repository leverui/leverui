import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { BarSegment, useChart } from '../src';
import './bar-segment-css.css';

/** Exercise authored presentation, reactive geometry, and consumer CSS. */
function BarSegmentCssContract(): JSX.Element {
  const [value, setValue] = createSignal(50);
  const [barSize, setBarSize] = createSignal<string>();
  const chart = useChart(
    /** Keep the second segment reactive without replacing the chart. */
    () => ({
      data: [
        { name: 'Google', value: 100, color: 'teal.solid' },
        { name: 'Direct', value: value(), color: 'blue.solid' },
      ],
      series: [{ name: 'name', color: 'teal.solid' }],
    }),
  );

  /** Increase a native segment width from the chart data. */
  function changeValue(): void {
    setValue(80);
  }

  /** Change the open bar size while retaining the same segments. */
  function changeSize(): void {
    setBarSize('3.5rem');
  }

  return (
    <>
      <button type="button" onClick={changeValue} data-testid="segment-data-toggle">
        Change value
      </button>
      <button type="button" onClick={changeSize} data-testid="segment-size-toggle">
        Change size
      </button>
      <BarSegment.Root
        chart={chart}
        barSize={barSize()}
        id="bar-segment-native-root"
        aria-label="Traffic channels"
        ref={
          /** Mark the forwarded root ref for the browser contract. */
          (element) => {
            element.dataset.ref = 'bound';
          }
        }
        class="consumer-bar-segment"
        style={{ width: '360px' }}
      >
        <BarSegment.Content
          id="bar-segment-native-content"
          onMouseLeave={
            /** Observe the consumer handler alongside internal tooltip cleanup. */
            (event) => {
              event.currentTarget.dataset.left = 'true';
            }
          }
        >
          <BarSegment.Value id="bar-segment-native-value" />
          <BarSegment.Bar
            tooltip
            id="bar-segment-native-bar"
            aria-label="Channel segments"
            ref={
              /** Mark the forwarded bar ref for the browser contract. */
              (element) => {
                element.dataset.ref = 'bound';
              }
            }
          >
            <BarSegment.Reference value={75} label="Target" id="bar-segment-native-reference" />
          </BarSegment.Bar>
          <BarSegment.Label id="bar-segment-native-label" />
        </BarSegment.Content>
        <BarSegment.Legend
          showPercent
          textStyle="xs"
          id="bar-segment-native-legend"
          class="consumer-segment-legend"
        />
      </BarSegment.Root>
    </>
  );
}

const meta = {
  title: 'Charts/BarSegment/Styles',
  component: BarSegmentCssContract,
} satisfies Meta<typeof BarSegmentCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
