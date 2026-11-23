import { cleanup, render } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { LineChart } from './line-chart';

afterEach(cleanup);

const data = [
  { month: 'January', sales: 10 },
  { month: 'February', sales: 30 },
  { month: 'March', sales: 20 },
];
const series = [{ name: 'sales', color: 'teal.solid' }];

/** Read the x position of each category label. */
function labelXs(container: HTMLElement): number[] {
  return [...container.querySelectorAll('.lui-cartesian-chart__axes text')].map(
    /** Read one label's x attribute. */
    (label) => Number(label.getAttribute('x')),
  );
}

/** Inset the first and last categories by the requested padding. */
function checksXPadding(): void {
  const { container } = render(
    /** Mount a chart with and without padding at the test width. */
    () => <LineChart data={data} series={series} xKey="month" xPadding={{ left: 20, right: 20 }} />,
  );
  const [first, , last] = labelXs(container);
  expect(first).toBe(25);
  expect(last).toBe(254);
}

/** Rotate category labels and anchor them at their tick. */
function checksTickAngle(): void {
  const { container } = render(
    /** Mount a chart with rotated labels. */
    () => <LineChart data={data} series={series} xKey="month" xTickAngle={-45} />,
  );
  const label = container.querySelector('.lui-cartesian-chart__axes text');
  expect(label?.getAttribute('text-anchor')).toBe('end');
  expect(label?.getAttribute('transform')).toMatch(/^rotate\(-45 /);
}

/** Draw the axis line and one tick mark per category, plus the value axis line. */
function checksAxisLines(): void {
  const { container } = render(
    /** Mount a chart with axis lines and a value axis. */
    () => <LineChart data={data} series={series} xKey="month" showAxisLines showYAxis />,
  );
  expect(container.querySelectorAll('.lui-cartesian-chart__axisLine')).toHaveLength(5);
  const plain = render(
    /** Mount the default chart without axis lines. */
    () => <LineChart data={data} series={series} xKey="month" />,
  );
  expect(plain.container.querySelectorAll('.lui-cartesian-chart__axisLine')).toHaveLength(0);
}

/** Keep the axis options off the chart's root element. */
function checksNoStrayAttributes(): void {
  const { container } = render(
    /** Mount a chart with every axis option that is not an HTML attribute. */
    () => (
      <LineChart
        data={data}
        series={series}
        xKey="month"
        xTickAngle={-45}
        xPadding={{ left: 20, right: 20 }}
        showAxisLines
        data-consumer="kept"
      />
    ),
  );
  const root = container.querySelector('.lui-cartesian-chart__root');
  const names = [...(root?.attributes ?? [])].map(
    /** Read one attribute's name as the browser stores it. */
    (attribute) => attribute.name.toLowerCase(),
  );
  expect(names).toContain('data-consumer');
  expect(names).not.toContain('xtickangle');
  expect(names).not.toContain('xpadding');
  expect(names).not.toContain('showaxislines');
}

it('insets categories with xPadding', checksXPadding);
it('rotates category labels with xTickAngle', checksTickAngle);
it('draws axis lines and ticks with showAxisLines', checksAxisLines);
it('keeps axis options off the root element', checksNoStrayAttributes);
