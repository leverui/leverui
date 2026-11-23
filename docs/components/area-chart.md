# Area Chart

Shows how amounts change over time, with the area under each line filled in.

```tsx
import { AreaChart } from '@leverui/components';
```

```tsx
<AreaChart
  data={[
    { month: 'January', windows: 186, mac: 80 },
    { month: 'February', windows: 165, mac: 95 },
  ]}
  xKey="month"
  series={[
    { name: 'windows', color: 'teal.solid' },
    { name: 'mac', color: 'purple.solid' },
  ]}
  aria-label="Monthly operating system counts"
/>
```

## Props

### Data

| Prop     | Default | Type                         | Description                              |
| -------- | ------- | ---------------------------- | ---------------------------------------- |
| `data`   | —       | `readonly CartesianDatum[]`  | Rows to draw. Required.                  |
| `xKey`   | —       | `string`                     | Field that holds the category. Required. |
| `series` | —       | `readonly CartesianSeries[]` | Number fields to draw. Required.         |

### Areas

| Prop                 | Default  | Type               | Description                                |
| -------------------- | -------- | ------------------ | ------------------------------------------ |
| `stacked`            | `false`  | `boolean`          | Stack the series.                          |
| `percent`            | `false`  | `boolean`          | Scale each stack to 100%.                  |
| `curve`              | `linear` | `CartesianCurve`   | Line shape.                                |
| `connectNulls`       | `false`  | `boolean`          | Draw the line across missing values.       |
| `fillOpacity`        | `0.2`    | `number`           | Fill opacity, 0 to 1.                      |
| `gradient`           | `false`  | `boolean`          | Fade the fill toward the bottom.           |
| `valueGradient`      | `false`  | `boolean`          | Color the area below zero red.             |
| `dots`               | `false`  | `boolean`          | Draw a dot at each value.                  |
| `pointLabels`        | `false`  | `boolean`          | Print each value at its point, with a dot. |
| `pointLabelPosition` | `top`    | `'top' \| 'right'` | Side of the point the value sits on.       |

`curve` values: `linear`, `bump`, `basis`, `step`, `stepBefore`, `stepAfter`,
`natural`, `monotone`.

Stacked with `connectNulls`: a missing value in the middle of a series sits on
the baseline of its stack.

### Axes and grid

| Prop              | Default | Type                                | Description                                                |
| ----------------- | ------- | ----------------------------------- | ---------------------------------------------------------- |
| `showXAxis`       | `true`  | `boolean`                           | Show category labels.                                      |
| `showYAxis`       | `false` | `boolean`                           | Show number labels on the left.                            |
| `showAxisLines`   | `false` | `boolean`                           | Draw axis lines and tick marks.                            |
| `xAxisLabel`      | —       | `string`                            | Title below the X-axis.                                    |
| `yAxisLabel`      | —       | `string`                            | Title beside the Y-axis.                                   |
| `rightYAxisLabel` | —       | `string`                            | Title beside the right Y-axis.                             |
| `xTickFormatter`  | —       | `(value: string) => string`         | Format each category label.                                |
| `yTickFormatter`  | —       | `(value: number) => string`         | Format each number label.                                  |
| `xTickValues`     | —       | `readonly string[]`                 | Only these categories get a label.                         |
| `yTickValues`     | —       | `readonly number[]`                 | Exact numbers that get a label and a grid line.            |
| `xTickAngle`      | `0`     | `number`                            | Rotate category labels, in degrees.                        |
| `xPadding`        | —       | `{ left?: number; right?: number }` | Space before the first and after the last category, in px. |
| `yDomain`         | —       | `readonly [number, number]`         | Lowest and highest number on the Y-axis.                   |
| `rightYDomain`    | —       | `readonly [number, number]`         | Lowest and highest number on the right Y-axis.             |
| `showGrid`        | `true`  | `boolean`                           | Show the grid.                                             |
| `gridHorizontal`  | `true`  | `boolean`                           | Show horizontal grid lines.                                |
| `gridVertical`    | `false` | `boolean`                           | Show vertical grid lines.                                  |
| `gridDashed`      | `false` | `boolean`                           | Dash the grid lines.                                       |

Set `yDomain` with `yTickValues` to put labels at exact numbers. More in
[Axis](axes.md) and [Cartesian Grid](cartesian-grid.md).

### Legend and tooltip

| Prop                | Default  | Type                           | Description                                     |
| ------------------- | -------- | ------------------------------ | ----------------------------------------------- |
| `showLegend`        | `false`  | `boolean`                      | Show a legend.                                  |
| `legendPlacement`   | `bottom` | `'bottom' \| 'top-right'`      | Legend position.                                |
| `legendReverse`     | `false`  | `boolean`                      | Reverse the legend order.                       |
| `legendInteraction` | —        | `'hover'`                      | Dim the other series on legend hover or focus.  |
| `tooltip`           | `true`   | `boolean`                      | Show values for the category under the pointer. |
| `tooltipContent`    | —        | `(row, series) => JSX.Element` | Render your own tooltip.                        |

### Reference marks

| Prop             | Default | Type       | Description                         |
| ---------------- | ------- | ---------- | ----------------------------------- |
| `referenceLines` | —       | `object[]` | Vertical lines at named categories. |
| `referenceArea`  | —       | `object`   | Shaded band between two categories. |
| `referenceValue` | —       | `object`   | Horizontal line at one number.      |
| `referencePoint` | —       | `object`   | Marker at one category and number.  |

| Mark             | Fields (`?` is optional)                    |
| ---------------- | ------------------------------------------- |
| `referenceLines` | `x`, `label?`, `color?`                     |
| `referenceArea`  | `x1`, `x2`, `label?`, `color?`              |
| `referenceValue` | `y`, `label?`, `color?`, `strokeDasharray?` |
| `referencePoint` | `x`, `y`, `color?`, `radius?`               |

`x`, `x1`, `x2` are category names. `y` is a number on the Y-axis.

### Size

| Prop         | Default | Type     | Description                                       |
| ------------ | ------- | -------- | ------------------------------------------------- |
| `height`     | —       | `number` | Fixed height, in pixels.                          |
| `maxHeight`  | `384`   | `number` | Tallest the chart grows when `height` is not set. |
| `plotMargin` | —       | `object` | Space around the plot, in pixels.                 |

Without `height`, the chart keeps a 4:3 shape up to `maxHeight`.

`plotMargin` takes `top`, `right`, `bottom`, `left`, each zero or more. Example:
`plotMargin={{ top: 40, left: 40, right: 40 }}`.

Other attributes and event handlers go to the root element.

## Series options

| Field                 | Type                                  | Description                                                 |
| --------------------- | ------------------------------------- | ----------------------------------------------------------- |
| `name`                | `string`                              | Number field in your data. Required.                        |
| `color`               | `string`                              | Color token such as `teal.solid`, or a CSS color. Required. |
| `label`               | `string`                              | Name in the legend and tooltip.                             |
| `stroke`              | `string`                              | Line color, if different from `color`.                      |
| `strokeWidth`         | `number`                              | Line thickness.                                             |
| `strokeDasharray`     | `string`                              | Dash pattern, such as `4 4`.                                |
| `strokeGradientStops` | `{ offset: string; color: string }[]` | Colors the line blends through, top to bottom.              |
| `dotRadius`           | `number`                              | Dot size.                                                   |
| `dotFill`             | `string`                              | Dot fill color.                                             |
| `dotStroke`           | `string`                              | Dot outline color.                                          |
| `dotStrokeWidth`      | `number`                              | Dot outline thickness.                                      |
| `activeDotRadius`     | `number`                              | Size of the dot under the pointer.                          |
| `activeDotStroke`     | `string`                              | Outline color of the dot under the pointer.                 |
| `yAxis`               | `'left' \| 'right'`                   | Y-axis the series uses.                                     |

## Keyboard

The chart takes focus when the tooltip is on.

| Key                      | Action                     |
| ------------------------ | -------------------------- |
| `ArrowLeft` `ArrowRight` | Previous or next category. |
| `Escape`                 | Close the tooltip.         |

## Styling

```tsx
<AreaChart class="traffic-area" data={data} xKey="month" series={series} />
```

```css
.traffic-area {
  --lui-cartesian-chart-legend-gap: 1rem;
  --lui-cartesian-chart-tooltip-bg: #f0faf8;
}

.traffic-area .lui-cartesian-chart__gridLine {
  stroke: #a6c9c0;
}
```

### Variables

| Variable                           | Default      | Description                    |
| ---------------------------------- | ------------ | ------------------------------ |
| `--lui-cartesian-chart-min-width`  | `280px`      | Narrowest the chart gets.      |
| `--lui-cartesian-chart-legend-gap` | `12px`       | Space between legend items.    |
| `--lui-cartesian-chart-tooltip-bg` | Panel color  | Tooltip background.            |
| `--lui-chart-axis-line-color`      | Border color | Axis line and tick mark color. |

Grid variables are in [Cartesian Grid](cartesian-grid.md).

### Classes

Root: `.lui-area-chart` and `.lui-cartesian-chart__root`.

Parts, each prefixed with `.lui-cartesian-chart__`: `svg`, `axes`,
`rightAxis`, `axisLine`, `axisTitle`, `gridLine`, `cursor`, `series`, `area`,
`line`, `dot`, `pointLabel`, `referenceLine`, `referenceArea`,
`referenceValue`, `referenceValueLabel`, `referencePoint`, `referenceLabel`,
`legend`, `legendItem`, `legendSwatch`, `tooltip`, `tooltipItem`,
`tooltipSwatch`.
