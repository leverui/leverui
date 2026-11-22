# Line Chart

Shows a trend over time as one or more lines.

```tsx
import { LineChart } from '@leverui/components';
```

```tsx
<LineChart
  data={[
    { month: 'January', sales: 10 },
    { month: 'February', sales: 95 },
  ]}
  xKey="month"
  series={[{ name: 'sales', color: 'teal.solid', strokeWidth: 2 }]}
  showYAxis
  aria-label="Monthly sales"
/>
```

## Props

### Data

| Prop     | Default | Type                         | Description                              |
| -------- | ------- | ---------------------------- | ---------------------------------------- |
| `data`   | —       | `readonly CartesianDatum[]`  | Rows to draw. Required.                  |
| `xKey`   | —       | `string`                     | Field that holds the category. Required. |
| `series` | —       | `readonly CartesianSeries[]` | Number fields to draw. Required.         |

### Lines

| Prop                 | Default  | Type               | Description                                |
| -------------------- | -------- | ------------------ | ------------------------------------------ |
| `curve`              | `linear` | `CartesianCurve`   | Line shape.                                |
| `connectNulls`       | `false`  | `boolean`          | Draw the line across missing values.       |
| `dots`               | `false`  | `boolean`          | Draw a dot at each value.                  |
| `pointLabels`        | `false`  | `boolean`          | Print each value at its point, with a dot. |
| `pointLabelPosition` | `top`    | `'top' \| 'right'` | Side of the point the value sits on.       |

`curve` values: `linear`, `bump`, `basis`, `step`, `stepBefore`, `stepAfter`,
`natural`, `monotone`.

Thickness, dashes and colors are set per line in
[Series options](#series-options).

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
| `yTickFormatter`  | —       | `(value: number) => string`         | Format each number label on the left.                      |
| `xTickValues`     | —       | `readonly string[]`                 | Only these categories get a label and a vertical line.     |
| `yTickValues`     | —       | `readonly number[]`                 | Exact numbers that get a label and a grid line.            |
| `xTickAngle`      | `0`     | `number`                            | Rotate category labels, in degrees.                        |
| `xPadding`        | —       | `{ left?: number; right?: number }` | Space before the first and after the last category, in px. |
| `yDomain`         | —       | `readonly [number, number]`         | Lowest and highest number on the Y-axis.                   |
| `rightYDomain`    | —       | `readonly [number, number]`         | Lowest and highest number on the right Y-axis.             |
| `showGrid`        | `true`  | `boolean`                           | Show the grid.                                             |
| `gridHorizontal`  | `true`  | `boolean`                           | Show horizontal grid lines.                                |
| `gridVertical`    | `false` | `boolean`                           | Show vertical grid lines.                                  |
| `gridDashed`      | `false` | `boolean`                           | Dash the grid lines.                                       |

Without `yDomain`, the Y-axis fits the data and includes zero. In `yDomain`,
the first number must be lower than the second.

Number labels round to whole numbers unless you pass `yTickFormatter`. Set
`yDomain` with `yTickValues` to put labels at exact numbers.

The right Y-axis shows when a series sets `yAxis` to `right`. Its labels are
always whole numbers.

Each `xPadding` value must be zero or more.

More in [Axis](axes.md) and [Cartesian Grid](cartesian-grid.md).

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
| `referenceValue` | —       | `object`   | Horizontal line at one number.      |
| `referencePoint` | —       | `object`   | Marker at one category and number.  |

| Mark             | Fields (`?` is optional)                    |
| ---------------- | ------------------------------------------- |
| `referenceLines` | `x`, `label?`, `color?`                     |
| `referenceValue` | `y`, `label?`, `color?`, `strokeDasharray?` |
| `referencePoint` | `x`, `y`, `color?`, `radius?`               |

`x` is a category name. `y` is a number on the left Y-axis. `color` defaults
to red, `radius` to `6`.

### Size

| Prop         | Default | Type     | Description                                       |
| ------------ | ------- | -------- | ------------------------------------------------- |
| `height`     | —       | `number` | Fixed height, in pixels.                          |
| `maxHeight`  | `384`   | `number` | Tallest the chart grows when `height` is not set. |
| `plotMargin` | —       | `object` | Space around the plot, in pixels.                 |

Without `height`, the chart keeps a 4:3 shape up to `maxHeight`. `maxHeight`
must be more than zero.

`plotMargin` takes `top`, `right`, `bottom`, `left`, each zero or more. Example:
`plotMargin={{ top: 40, left: 40, right: 40 }}`.

Other attributes and event handlers go to the root element.

## Series options

| Field                 | Type                                  | Description                                                       |
| --------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| `name`                | `string`                              | Number field in your data. Required.                              |
| `color`               | `string`                              | Color token such as `teal.solid`, or a CSS color. Required.       |
| `label`               | `string`                              | Name in the legend and tooltip. Default `name`.                   |
| `stroke`              | `string`                              | Line color only. Dots and legend keep `color`.                    |
| `strokeWidth`         | `number`                              | Line thickness. Default `1`.                                      |
| `strokeDasharray`     | `string`                              | Dash pattern, such as `4 4`.                                      |
| `strokeGradientStops` | `{ offset: string; color: string }[]` | Colors the line blends through, top to bottom. Replaces `stroke`. |
| `dotRadius`           | `number`                              | Dot size. Default `3`.                                            |
| `dotFill`             | `string`                              | Dot fill color. Default `color`.                                  |
| `dotStroke`           | `string`                              | Dot outline color. Default page background.                       |
| `dotStrokeWidth`      | `number`                              | Dot outline thickness. Default `1`.                               |
| `activeDotRadius`     | `number`                              | Size of the dot under the pointer. Default `dotRadius`.           |
| `activeDotStroke`     | `string`                              | Outline color of the dot under the pointer.                       |
| `yAxis`               | `'left' \| 'right'`                   | Y-axis the series uses. Default `left`.                           |

```tsx
<LineChart
  data={data}
  xKey="month"
  series={[
    {
      name: 'sales',
      color: 'teal.solid',
      strokeGradientStops: [
        { offset: '0%', color: 'teal.solid' },
        { offset: '100%', color: 'purple.solid' },
      ],
    },
  ]}
/>
```

## Keyboard

The chart takes focus when the tooltip is on.

| Key                      | Action                     |
| ------------------------ | -------------------------- |
| `ArrowLeft` `ArrowRight` | Previous or next category. |
| `Escape`                 | Close the tooltip.         |

## Styling

```tsx
<LineChart class="sales-line" data={data} xKey="month" series={series} />
```

```css
.sales-line {
  --leverui-cartesian-chart-legend-gap: 1rem;
}

.sales-line .leverui-cartesian-chart__pointLabel {
  font-size: 0.875rem;
}
```

### Variables

| Variable                               | Default      | Description                    |
| -------------------------------------- | ------------ | ------------------------------ |
| `--leverui-cartesian-chart-min-width`  | `280px`      | Narrowest the chart gets.      |
| `--leverui-cartesian-chart-legend-gap` | `12px`       | Space between legend items.    |
| `--leverui-cartesian-chart-tooltip-bg` | Panel color  | Tooltip background.            |
| `--leverui-chart-axis-line-color`      | Border color | Axis line and tick mark color. |

Grid variables are in [Cartesian Grid](cartesian-grid.md).

### Classes

Root: `.leverui-line-chart` and `.leverui-cartesian-chart__root`.

Parts, each prefixed with `.leverui-cartesian-chart__`: `svg`, `axes`,
`rightAxis`, `axisLine`, `axisTitle`, `gridLine`, `series`, `line`, `dot`,
`pointLabel`, `referenceLine`, `referenceValue`, `referenceValueLabel`,
`referencePoint`, `referenceLabel`, `cursor`, `legend`, `legendItem`,
`legendSwatch`, `tooltip`, `tooltipItem`, `tooltipSwatch`.
