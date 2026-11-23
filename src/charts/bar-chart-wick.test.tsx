import { cleanup, render } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { BarChart } from './bar-chart';

afterEach(cleanup);

/** Draw a candlestick's wick from its high to its low, whichever way the body runs. */
function drawsWickFromHighToLow(): void {
  const { container } = render(
    /** Mount a falling and a rising candle whose wicks span the whole value axis. */
    () => (
      <BarChart
        data={[
          { day: 'Monday', open_close: [184, 182], high_low: [185, 181] },
          { day: 'Tuesday', open_close: [182, 184], high_low: [185, 181] },
        ]}
        xKey="day"
        series={[{ name: 'open_close', color: 'teal.solid', wickKey: 'high_low' }]}
        yDomain={[181, 185]}
        height={200}
      />
    ),
  );
  const stems = [...container.querySelectorAll('.lui-bar-chart__wick')].map(
    /** Read the top and bottom of one wick's stem. */
    (wick) => {
      const stem = wick.querySelector('line');
      return [Number(stem?.getAttribute('y1')), Number(stem?.getAttribute('y2'))];
    },
  );
  // The high sits at the top of the plot and the low at its bottom, for both candles.
  expect(stems).toEqual([
    [5, 165],
    [5, 165],
  ]);
}

it('draws a candlestick wick from its high to its low', drawsWickFromHighToLow);
