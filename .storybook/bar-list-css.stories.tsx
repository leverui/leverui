import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { BarList, useChart } from '../src';
import './bar-list-css.css';

/** Exercise authored Bar List CSS with live geometry and consumer overrides. */
function BarListCssContract(): JSX.Element {
  const [barSize, setBarSize] = createSignal<string>();
  const [visits, setVisits] = createSignal(25);
  const chart = useChart(
    /** Keep the bar width reactive to a changed chart datum. */
    () => ({
      data: [
        { name: 'Direct', value: 50 },
        { name: 'Referral', value: visits() },
      ],
      series: [
        { name: 'value', color: 'red.solid' },
        { name: 'name', color: 'teal.subtle' },
      ],
    }),
  );

  /** Change only the root's open size value, retaining the same rows. */
  function enlarge(): void {
    setBarSize('12');
  }

  /** Change a series value without replacing the Bar List root. */
  function updateData(): void {
    setVisits(40);
  }

  return (
    <>
      <button onClick={enlarge} data-testid="bar-list-size-toggle">
        Increase size
      </button>
      <button onClick={updateData} data-testid="bar-list-data-toggle">
        Update visits
      </button>
      <BarList.Root
        chart={chart}
        barSize={barSize()}
        id="bar-list-native-root"
        aria-label="Traffic sources"
        ref={
          /** Mark the forwarded root ref for the browser contract. */
          (element) => {
            element.dataset.ref = 'bound';
          }
        }
        class="bar-list-consumer"
      >
        <BarList.Title id="bar-list-native-title">Traffic</BarList.Title>
        <BarList.Content id="bar-list-native-content">
          <BarList.Label title="Source" flex="1" minW="48" id="bar-list-native-label">
            <BarList.Bar
              tooltip
              id="bar-list-native-bar"
              aria-label="Source bars"
              onMouseEnter={
                /** Confirm native events arrive at the public bar column. */
                (event) => {
                  event.currentTarget.dataset.entered = 'true';
                }
              }
              ref={
                /** Mark the forwarded bar ref for the browser contract. */
                (element) => {
                  element.dataset.ref = 'bound';
                }
              }
              class="consumer-bar"
              style={{ 'min-width': '180px' }}
            />
          </BarList.Label>
          <BarList.Label title="Visits">
            <BarList.Value id="bar-list-native-value" />
          </BarList.Label>
        </BarList.Content>
      </BarList.Root>
    </>
  );
}

const meta = {
  title: 'Charts/BarList/Styles',
  component: BarListCssContract,
} satisfies Meta<typeof BarListCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
