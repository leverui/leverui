import { expect, test } from 'vitest';
import type { BarChartProps } from './bar-chart-types';
import { validateBarOptions } from './bar-validation';

const chart: BarChartProps = {
  data: [{ name: 'UK', value: [10, 20] }],
  xKey: 'name',
  series: [{ name: 'value', color: 'teal.solid' }],
};

/** Reject malformed public tick values before they become SVG coordinates. */
function rejectsNonfiniteTicks(): void {
  expect(
    /** Check a missing numeric coordinate within the tick list. */
    () => validateBarOptions({ ...chart, yTickValues: [0, Number.NaN] }),
  ).toThrow(/yTickValues/);
  expect(
    /** Check an unbounded numeric coordinate within the tick list. */
    () => validateBarOptions({ ...chart, yTickValues: [Number.POSITIVE_INFINITY] }),
  ).toThrow(/yTickValues/);
}

/** Reject side insets that would make chart placement invalid. */
function rejectsInvalidInsets(): void {
  expect(
    /** Check a negative left plot margin. */
    () => validateBarOptions({ ...chart, leftInset: -1 }),
  ).toThrow(/leftInset/);
  expect(
    /** Check an invalid right plot margin. */
    () => validateBarOptions({ ...chart, rightInset: Number.NaN }),
  ).toThrow(/rightInset/);
}

/** Keep numeric label placement finite when consumers customize offsets. */
function rejectsInvalidLabelOffset(): void {
  expect(
    /** Check a malformed negative-value label offset. */
    () =>
      validateBarOptions({
        ...chart,
        series: [{ name: 'value', color: 'teal.solid', label: { negativeOffset: -1 } }],
      }),
  ).toThrow(/label offset/);
}

test('Bar Chart rejects nonfinite numeric ticks', rejectsNonfiniteTicks);
test('Bar Chart rejects invalid side insets', rejectsInvalidInsets);
test('Bar Chart rejects invalid numeric label offsets', rejectsInvalidLabelOffset);

/** Reject a nonfinite or nonpositive responsive frame cap. */
function rejectsInvalidMaxHeight(): void {
  expect(
    /** Reject zero before it can collapse the SVG plot. */
    () => validateBarOptions({ ...chart, maxHeight: 0 }),
  ).toThrow(/maxHeight/);
  expect(
    /** Reject an unbounded cap before it reaches SVG sizing. */
    () => validateBarOptions({ ...chart, maxHeight: Number.POSITIVE_INFINITY }),
  ).toThrow(/maxHeight/);
}

test('Bar Chart rejects invalid responsive height caps', rejectsInvalidMaxHeight);
