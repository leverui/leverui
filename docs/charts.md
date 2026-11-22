# Charts

Charts ship in `@leverui/components`. Once Lever UI is
[set up](getting-started.md), there is nothing more to install.

<!-- example: area-chart/Basic -->

## Usage

### Import the charts component

```tsx
import { BarChart, useChart } from '@leverui/components';
```

### Define chart data

More in [`useChart`](components/use-chart.md).

```tsx
const chart = useChart({
  data: [
    { month: 'January', value: 100 },
    { month: 'February', value: 200 },
  ],
  series: [{ name: 'value', color: 'teal.solid' }],
});
```

### Render the chart

```tsx
<BarChart
  data={chart.data}
  xKey="month"
  series={chart.series.map((item) => ({
    name: chart.key(item.name),
    color: chart.color(item.color) ?? 'teal.solid',
  }))}
/>
```

The hook is optional. Most charts also take plain `data` and `series` arrays.

## Chart types

- [Area Chart](components/area-chart.md): amounts over time, filled.
- [Bar Chart](components/bar-chart.md): amounts side by side.
- [Bar List](components/bar-list.md): a ranked list.
- [Bar Segment](components/bar-segment.md): parts of a total on one bar.
- [Donut Chart](components/donut-chart.md): parts of a whole, with a center title.
- [Line Chart](components/line-chart.md): a trend over time.
- [Pie Chart](components/pie-chart.md): parts of a whole.
- [Radar Chart](components/radar-chart.md): several measures on one shape.
- [Scatter Chart](components/scatter-chart.md): how two numbers relate.
- [Sparkline](components/sparkline.md): a small trend line.

## Customization

Each chart's page lists its props and CSS variables.

### Colors

`chart.color` turns a color token into its CSS variable.

```tsx
<BarChart
  style={{ '--leverui-chart-grid-color': chart.color('border.muted') }}
  data={chart.data}
  xKey="month"
  series={[{ name: 'value', color: 'teal.solid' }]}
/>
```

### Formatters

`formatDate` and `formatNumber` use the locale from
[`LocaleProvider`](components/locale-provider.md). `formatDate` needs date strings such
as `2024-01-01` in the X-axis field.

```tsx
<LineChart
  data={chart.data}
  xKey="date"
  series={[{ name: 'revenue', color: 'teal.solid' }]}
  // format the X-axis labels
  xTickFormatter={chart.formatDate({ month: 'short', day: '2-digit' })}
  // format the Y-axis labels
  yTickFormatter={chart.formatNumber({ maximumFractionDigits: 1 })}
/>
```
