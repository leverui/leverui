import { cleanup, fireEvent, render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, it, vi } from 'vitest';
import { Sparkline, type SparklineData } from './sparkline';

afterEach(cleanup);

/** Keep active geometry valid as the caller changes or clears its series. */
function verifiesChangingSeries(): void {
  const [data, setData] = createSignal<readonly SparklineData[]>([
    { value: 10 },
    { value: 20 },
    { value: 15 },
  ]);
  const [activeIndex, setActiveIndex] = createSignal<number | null>(2);
  const onActiveIndexChange = vi.fn();
  const view = render(
    /** Keep the active index and plotted data under one Solid owner. */
    () => (
      <Sparkline
        data={data()}
        activeIndex={activeIndex()}
        onActiveIndexChange={onActiveIndexChange}
      />
    ),
  );
  const chart = view.container.querySelector('svg');
  if (!chart) throw new Error('The Sparkline test SVG did not mount.');
  expect(chart.querySelector('.lui-sparkline__active-point')).not.toBeNull();

  setData([{ value: 10 }]);
  flush();
  expect(chart.querySelector('.lui-sparkline__active-point')).toBeNull();
  setActiveIndex(0);
  flush();
  expect(chart.querySelector('.lui-sparkline__active-point')).not.toBeNull();

  setData([]);
  flush();
  expect(chart.querySelector('.lui-sparkline__active-point')).toBeNull();
  fireEvent.pointerMove(chart);
  expect(onActiveIndexChange).toHaveBeenLastCalledWith(null);
}

it('hides stale active markers and reports no point for an empty chart', verifiesChangingSeries);
