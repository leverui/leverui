import {
  AreaChart,
  BarChart,
  LineChart,
  type AreaChartProps,
  type BarChartProps,
  type LineChartProps,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

type ExpectFalse<Value extends false> = Value;

export type AreaObjectCssRejected = ExpectFalse<'css' extends keyof AreaChartProps ? true : false>;
export type LineObjectCssRejected = ExpectFalse<'css' extends keyof LineChartProps ? true : false>;
export type BarObjectCssRejected = ExpectFalse<'css' extends keyof BarChartProps ? true : false>;

const data = [{ month: 'January', value: 10 }];
const series = [{ name: 'value', color: 'teal.solid' }];

/** Check CSS-first chart options through the installed public declarations. */
export function PackedChartCssTypes(): JSX.Element {
  return (
    <>
      <AreaChart
        data={data}
        series={series}
        xKey="month"
        gridHorizontal={false}
        plotMargin={{ top: 40, left: 40, right: 40 }}
        maxHeight={448}
      />
      <LineChart
        data={data}
        series={series}
        xKey="month"
        gridHorizontal={false}
        plotMargin={{ top: 40 }}
        maxHeight={448}
      />
      <BarChart data={data} series={series} xKey="month" maxHeight={448} />
    </>
  );
}
