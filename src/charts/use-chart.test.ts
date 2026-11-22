import { createRoot, createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { useChart } from './use-chart';

/** Preserve source data while sorting and handle negative or empty maxima. */
function checksNumericData(): void {
  const source = [{ value: 2 }, { value: 8 }, { value: 4 }];
  createRoot(
    /** Own chart computations for the length of this assertion. */
    (dispose) => {
      const chart = useChart({ data: source, sort: { by: 'value', direction: 'desc' } });
      expect(
        chart.data.map(
          /** Read the sorted numeric values. */
          (item) => item.value,
        ),
      ).toEqual([8, 4, 2]);
      expect(
        source.map(
          /** Confirm the input array retains its original order. */
          (item) => item.value,
        ),
      ).toEqual([2, 8, 4]);
      expect(chart.getTotal('value')).toBe(14);
      expect(chart.getValuePercent('value', 8, [0, chart.getMax('value')])).toBe(100);
      expect(useChart({ data: [{ value: -5 }, { value: -2 }] }).getMax('value')).toBe(-2);
      expect(useChart({ data: [] as { value: number }[] }).getMax('value')).toBe(0);
      dispose();
    },
  );
}

/** Recompute sorted data and percentages when Solid input changes. */
function checksReactiveData(): void {
  const [data, setData] = createSignal([{ value: 2 }, { value: 4 }]);
  const { chart, dispose } = createRoot(
    /** Own the chart model until the assertions complete. */
    (dispose) => ({
      chart: useChart(
        /** Pass the latest data through the chart accessor. */
        () => ({ data: data(), sort: { by: 'value', direction: 'desc' } }),
      ),
      dispose,
    }),
  );
  expect(chart.data[0]?.value).toBe(4);
  // Solid 2 rejects writes inside an owner's body, so the data changes outside the root.
  setData([{ value: 10 }, { value: 1 }]);
  flush();
  expect(chart.data[0]?.value).toBe(10);
  expect(chart.getValuePercent('value', 10)).toBeCloseTo(90.91, 2);
  dispose();
}

it('sorts numeric data without mutation and handles maximum bounds', checksNumericData);
it('reacts to a changing chart data accessor', checksReactiveData);
