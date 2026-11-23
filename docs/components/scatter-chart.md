# Scatter Chart

Plots points to show how two numbers relate to each other.

```tsx
import { ScatterChart } from '@leverui/components';
```

```tsx
<ScatterChart
  data={[
    { temperature: 14.2, sales: 215 },
    { temperature: 16.4, sales: 325 },
  ]}
  xKey="temperature"
  yKey="sales"
  series={[{ name: 'sales', color: 'teal.solid' }]}
  xDomain={[10, 28.1]}
  yDomain={[0, 800]}
  aria-label="Sales by temperature"
/>
```

## Props

### Data

| Prop     | Default | Type                       | Description                                   |
| -------- | ------- | -------------------------- | --------------------------------------------- |
| `data`   | —       | `readonly ScatterDatum[]`  | Rows to plot. Required.                       |
| `xKey`   | —       | `string`                   | Field that holds the X-axis number. Required. |
| `yKey`   | —       | `string`                   | Field that holds the Y-axis number. Required. |
| `series` | —       | `readonly ScatterSeries[]` | Groups of points and their colors. Required.  |

Rows where either value is not a number are skipped.

### Points and lines

| Prop          | Default | Type      | Description                                |
| ------------- | ------- | --------- | ------------------------------------------ |
| `connectDots` | `false` | `boolean` | Join each series' points, in data order.   |
| `trendLine`   | `false` | `boolean` | Draw one best-fit line through all points. |

`trendLine` needs at least two points with different X values.

### Axes

| Prop         | Default | Type                        | Description                              |
| ------------ | ------- | --------------------------- | ---------------------------------------- |
| `xDomain`    | —       | `readonly [number, number]` | Lowest and highest number on the X-axis. |
| `yDomain`    | —       | `readonly [number, number]` | Lowest and highest number on the Y-axis. |
| `xTicks`     | —       | `readonly number[]`         | Exact numbers that get an X-axis label.  |
| `xFormatter` | —       | `(value: number) => string` | Format each X-axis label.                |

Without `xDomain`, the X-axis runs from the lowest to the highest X value in
the data. Without `yDomain`, the Y-axis runs from zero to a round number at or
above the highest Y value. A domain whose first number is not lower than its
second throws an error.

Without `xTicks`, the X-axis gets five evenly spaced labels. The Y-axis always
has five.

### Legend and tooltip

| Prop         | Default | Type      | Description                                      |
| ------------ | ------- | --------- | ------------------------------------------------ |
| `showLegend` | `false` | `boolean` | Show a legend below the plot.                    |
| `tooltip`    | `false` | `boolean` | Show both values of the point under the pointer. |

The tooltip also draws dashed guide lines at the point. The legend lists the
series from last to first.

### Size

| Prop         | Default | Type     | Description                                                 |
| ------------ | ------- | -------- | ----------------------------------------------------------- |
| `height`     | `384`   | `number` | Height, in pixels.                                          |
| `topInset`   | `5`     | `number` | Space above the plot, in pixels.                            |
| `leftInset`  | `65`    | `number` | Space left of the plot, in pixels. Holds the Y-axis labels. |
| `rightInset` | `6`     | `number` | Space right of the plot, in pixels.                         |

A negative inset, or insets that leave no room for the plot, throw an error.
The space below the plot is fixed at 35 pixels, or 64 with a legend, so
`height` must be greater than that plus `topInset`.

Other attributes and event handlers go to the root element.

## Series options

| Field     | Type     | Description                                                 |
| --------- | -------- | ----------------------------------------------------------- |
| `name`    | `string` | Name in the legend and tooltip. Required.                   |
| `color`   | `string` | Color token such as `teal.solid`, or a CSS color. Required. |
| `groupId` | `string` | Draw only the rows whose `id` field matches.                |

Without `groupId`, a series draws every row.

```tsx
<ScatterChart
  data={[
    { id: 'group1', x: 100, y: 200 },
    { id: 'group2', x: 140, y: 250 },
  ]}
  xKey="x"
  yKey="y"
  series={[
    { name: 'Group 1', color: 'blue.solid', groupId: 'group1' },
    { name: 'Group 2', color: 'green.solid', groupId: 'group2' },
  ]}
/>
```

## Keyboard

The chart takes focus when the tooltip is on. Focus shows the first point.

| Key                      | Action                  |
| ------------------------ | ----------------------- |
| `ArrowLeft` `ArrowRight` | Previous or next point. |
| `Escape`                 | Close the tooltip.      |

## Styling

```tsx
<ScatterChart class="sales-scatter" data={data} xKey="x" yKey="y" series={series} />
```

```css
.sales-scatter {
  --lui-scatter-chart-trend-stroke: #2f6f62;
  --lui-scatter-chart-legend-gap: 1rem;
}

.sales-scatter .leverui-scatter-chart__point {
  opacity: 0.8;
}
```

### Variables

| Variable                                      | Default           | Description                                 |
| --------------------------------------------- | ----------------- | ------------------------------------------- |
| `--lui-scatter-chart-width`                   | `100%`            | Width of the chart's box.                   |
| `--lui-scatter-chart-height`                  | The `height` prop | Height of the chart's box.                  |
| `--lui-scatter-chart-axis-stroke`             | Border color      | Axis line and tick mark color.              |
| `--lui-scatter-chart-axis-stroke-width`       | `1px`             | Axis line and tick mark thickness.          |
| `--lui-scatter-chart-tick-color`              | Muted text color  | Axis label color.                           |
| `--lui-scatter-chart-tick-font-size`          | `12px`            | Axis label size.                            |
| `--lui-scatter-chart-cursor-stroke`           | Border color      | Guide line color at the active point.       |
| `--lui-scatter-chart-cursor-dasharray`        | `3 3`             | Guide line dash pattern.                    |
| `--lui-scatter-chart-trend-stroke`            | Solid red         | Trend line color.                           |
| `--lui-scatter-chart-trend-stroke-width`      | `2px`             | Trend line thickness.                       |
| `--lui-scatter-chart-connection-stroke`       | Border color      | Color of the line joining the points.       |
| `--lui-scatter-chart-connection-stroke-width` | `2px`             | Thickness of that line.                     |
| `--lui-scatter-chart-legend-bottom`           | `8px`             | Gap between the legend and the bottom edge. |
| `--lui-scatter-chart-legend-gap`              | `12px`            | Space between legend items.                 |
| `--lui-scatter-chart-legend-font-size`        | `12px`            | Legend text size.                           |
| `--lui-scatter-chart-legend-color`            | Muted text color  | Legend text color.                          |
| `--lui-scatter-chart-legend-swatch-size`      | `8px`             | Width and height of a legend swatch.        |
| `--lui-scatter-chart-legend-swatch-radius`    | `2px`             | Swatch corner radius.                       |
| `--lui-scatter-chart-legend-swatch-gap`       | `4px`             | Space between a swatch and its name.        |

### Classes

Root: `.leverui-scatter-chart`.

Parts, each prefixed with `.leverui-scatter-chart__`: `svg`, `axes`,
`axis-line`, `tick`, `tick-label`, `cursor`, `trend`, `series`, `connection`,
`point`, `legend`, `legend-item`, `legend-swatch`.

Each `series` group has a `data-scatter-series` attribute set to the series
name. Tooltip: `.leverui-chart-tooltip`.
