# Bar Chart

Compares amounts side by side as vertical or horizontal bars.

```tsx
import { BarChart } from '@leverui/components';
```

```tsx
<BarChart
  data={[
    { month: 'January', windows: 186, mac: 80 },
    { month: 'February', windows: 165, mac: 95 },
  ]}
  xKey="month"
  series={[
    { name: 'windows', color: 'teal.solid' },
    { name: 'mac', color: 'purple.solid' },
  ]}
  showLegend
  tooltip
  aria-label="Monthly operating system downloads"
/>
```

## Props

A prop outside the limit in its description throws an error.

### Data

| Prop     | Default | Type                   | Description                              |
| -------- | ------- | ---------------------- | ---------------------------------------- |
| `data`   | —       | `readonly BarDatum[]`  | Rows to draw. Required.                  |
| `xKey`   | —       | `string`               | Field that holds the category. Required. |
| `series` | —       | `readonly BarSeries[]` | Number fields to draw. Required.         |

A value is a number or a pair such as `[10, 20]`. A value that is missing,
zero, or not a number draws no bar.

### Bars

| Prop          | Default    | Type                         | Description                                         |
| ------------- | ---------- | ---------------------------- | --------------------------------------------------- |
| `orientation` | `vertical` | `'vertical' \| 'horizontal'` | Bar direction.                                      |
| `percent`     | `false`    | `boolean`                    | Scale each stack to 100%. Vertical only.            |
| `barSize`     | —          | `number`                     | Bar thickness, in pixels. More than 0.              |
| `categoryGap` | `0.2`      | `number`                     | Empty share of each category's space. 0 to under 1. |
| `barGap`      | `4`        | `number`                     | Space between bars in a category, in px. 0 or more. |

Without `barSize`, bars fill their space. A bar never grows past that space,
even with a larger `barSize`.

### Axes and grid

| Prop             | Default | Type                        | Description                                        |
| ---------------- | ------- | --------------------------- | -------------------------------------------------- |
| `showXAxis`      | `true`  | `boolean`                   | Show the labels along the bottom.                  |
| `showYAxis`      | `true`  | `boolean`                   | Show the labels along the side.                    |
| `yAxisPlacement` | `left`  | `'left' \| 'right'`         | Side the number labels sit on.                     |
| `showAxisLines`  | `false` | `boolean`                   | Draw a line on the left and bottom edges.          |
| `xAxisLabel`     | —       | `string`                    | Title below the X-axis.                            |
| `yAxisLabel`     | —       | `string`                    | Title beside the Y-axis, on the left.              |
| `xTickFormatter` | —       | `(value: string) => string` | Format each category label.                        |
| `xTickEvery`     | `1`     | `number`                    | Label every nth category. Whole number, 1 or up.   |
| `xTickRenderer`  | —       | `function`                  | Draw your own category labels.                     |
| `yTickFormatter` | —       | `(value: number) => string` | Format each number label.                          |
| `yTickValues`    | —       | `readonly number[]`         | Exact numbers that get a label and a grid line.    |
| `yDomain`        | —       | `readonly [number, number]` | Lowest, then highest number on the number axis.    |
| `showGrid`       | `true`  | `boolean`                   | Show horizontal grid lines.                        |
| `verticalGrid`   | `false` | `boolean`                   | Add a vertical grid line at each labeled category. |
| `gridDashed`     | `false` | `boolean`                   | Dash the grid lines.                               |

`xTickRenderer` gets `(row, index, x, y)` and returns an SVG element. `row` is
the data row, `index` its position in `data`, `x` and `y` where the label
would sit.

Without `yDomain`, the number axis runs from 0 to the tallest bar or stack.
Without `yTickValues`, it shows five evenly spaced labels, rounded to whole
numbers. Set `yDomain` with `yTickValues` to put labels at exact numbers.

With `percent`, the number axis runs from 0 to 1 and labels read as
percentages. `yTickFormatter` receives `0.5` for 50%.

A horizontal chart uses fewer of these props. See "Horizontal" under "Kinds of
bars".

### Legend and tooltip

| Prop                    | Default  | Type                        | Description                                      |
| ----------------------- | -------- | --------------------------- | ------------------------------------------------ |
| `showLegend`            | `false`  | `boolean`                   | Show a legend.                                   |
| `legendPlacement`       | `bottom` | `'bottom' \| 'top-right'`   | Legend position.                                 |
| `tooltip`               | `false`  | `boolean`                   | Show values for the category under the pointer.  |
| `tooltipLabelFormatter` | —        | `(row: BarDatum) => string` | Format the tooltip title. Default: the category. |

The legend lists series in alphabetical order. The tooltip sits in the top
right corner of the chart.

### Reference marks

| Prop             | Default | Type     | Description                           |
| ---------------- | ------- | -------- | ------------------------------------- |
| `referenceArea`  | —       | `object` | Shaded band between two numbers.      |
| `referenceValue` | —       | `object` | Dashed horizontal line at one number. |

| Mark             | Fields (`?` is optional)         |
| ---------------- | -------------------------------- |
| `referenceArea`  | `from`, `to`, `label?`, `color?` |
| `referenceValue` | `value`, `color?`                |

`from`, `to`, `value` are numbers on the Y-axis. `color` is a color token or a
CSS color. Vertical charts only.

### Size and style

| Prop          | Default | Type      | Description                                                    |
| ------------- | ------- | --------- | -------------------------------------------------------------- |
| `height`      | —       | `number`  | Fixed height, in pixels.                                       |
| `maxHeight`   | `384`   | `number`  | Tallest the chart grows when `height` is not set. More than 0. |
| `topInset`    | `5`     | `number`  | Space above the bars, in pixels. 0 or more.                    |
| `bottomInset` | `35`    | `number`  | Space below the bars, in pixels. 0 or more.                    |
| `leftInset`   | `65`    | `number`  | Space left of the bars, in pixels. 0 or more.                  |
| `rightInset`  | `6`     | `number`  | Space right of the bars, in pixels. 0 or more.                 |
| `unstyled`    | `false` | `boolean` | Turn off the Lever UI styles.                                  |

Without `height`, the chart keeps a 4:3 shape up to `maxHeight`. With `height`,
`maxHeight` is ignored.

Axis labels and the legend sit in the insets. Inset defaults change to make
room:

- `bottomInset` is `63` when the legend is at the bottom.
- `leftInset` is `5` when the Y-axis is hidden or on the right.
- `rightInset` is `65` when the Y-axis is on the right, and `100` when the
  legend is at the top right.

Set an inset when labels need more room, such as `topInset={30}` for value
labels above tall bars. The chart must be taller than `topInset` plus
`bottomInset`, and wider than `leftInset` plus `rightInset`.

Other attributes and event handlers go to the root element.

## Series options

| Field              | Type                                     | Description                                                            |
| ------------------ | ---------------------------------------- | ---------------------------------------------------------------------- |
| `name`             | `string`                                 | Number field in your data. Also the legend and tooltip name. Required. |
| `color`            | `string`                                 | Color token such as `teal.solid`, or a CSS color. Required.            |
| `stackId`          | `string`                                 | Series with the same `stackId` stack into one bar.                     |
| `radius`           | `number`                                 | Radius of all four corners, in pixels. 0 or more.                      |
| `fillOpacity`      | `number`                                 | Fill opacity, 0 to 1.                                                  |
| `stroke`           | `string`                                 | Bar outline, as a CSS color.                                           |
| `label`            | `boolean \| object`                      | Print each bar's value next to it.                                     |
| `colorKey`         | `string`                                 | Row field that holds that row's bar color.                             |
| `colorBySign`      | `{ positive: string; negative: string }` | Colors for bars above and below zero.                                  |
| `colorByDirection` | `{ up: string; down: string }`           | Colors for rising and falling pairs.                                   |
| `wickKey`          | `string`                                 | Row field that holds a candlestick's `[high, low]` wick pair.          |

`stroke` takes a CSS color, not a color token. A stroke in the background
color, such as `var(--lui-colors-bg)`, draws a thin gap between bars that
touch.

Color precedence: `colorKey`, then `colorByDirection`, then `colorBySign`, then
`color`.

`label` is `true` for the default look, or an object:

| Field            | Default    | Type         | Description                                            |
| ---------------- | ---------- | ------------ | ------------------------------------------------------ |
| `color`          | Text color | `string`     | Color token or a CSS color.                            |
| `weight`         | `600`      | `500 \| 600` | Text weight.                                           |
| `positiveOffset` | `5`        | `number`     | Distance above a bar, in pixels. 0 or more.            |
| `negativeOffset` | `19`       | `number`     | Distance below a bar under zero, in pixels. 0 or more. |

## Kinds of bars

### Grouped and stacked

Series sit side by side in each category. Series with the same `stackId` stack
into one bar, values above zero upward and values below zero downward.

### 100% stacked

Set `percent` on a stacked chart to stretch every stack to the full height.
Vertical charts only.

### Horizontal

Set `orientation="horizontal"` to draw one row for each category, with
category labels on the left and number labels at the bottom.

Works with grouped and stacked bars. Axis and grid props it uses: `showXAxis`,
`showYAxis`, `showGrid`, `xTickFormatter`, `yDomain`. Vertical only: the other
axis and grid props, `percent`, floating ranges, candlesticks, reference marks.

### Floating ranges

Write a value as a pair, such as `[10, 20]`, to draw a bar from the first
number to the second. The label and the tooltip show the second number.

### Candlesticks

Use a pair for the body of each candle and a second pair, named in `wickKey`,
for its wick.

```tsx
<BarChart
  data={[
    { date: 'Jan 01', open_close: [185.9, 185.6], high_low: [186.7, 185.2] },
    { date: 'Jan 02', open_close: [184.2, 185.1], high_low: [185.2, 182.7] },
  ]}
  xKey="date"
  series={[
    {
      name: 'open_close',
      color: 'teal.solid',
      wickKey: 'high_low',
      colorByDirection: { up: 'green.solid', down: 'red.solid' },
    },
  ]}
  yDomain={[181.5, 187]}
/>
```

For `colorByDirection`, a candle is falling when its first number is higher
than its second. Set `yDomain` to the price range, or the number axis starts
at zero.

### Positive and negative colors

Set `colorBySign` on a series to color bars above and below zero differently.
The number axis starts at zero, so set `yDomain` to include your lowest
number, such as `yDomain={[-400, 400]}`.

## Keyboard

The chart takes focus when `tooltip` is set. Focus selects the first category.

| Key                      | Action                     |
| ------------------------ | -------------------------- |
| `ArrowLeft` `ArrowRight` | Previous or next category. |
| `Escape`                 | Close the tooltip.         |

Your own `onFocus`, `onBlur`, and `onKeyDown` handlers still run.

## Styling

```tsx
<BarChart class="downloads-bars" data={data} xKey="month" series={series} />
```

```css
.downloads-bars {
  --lui-bar-chart-legend-gap: 1rem;
  --lui-bar-chart-tooltip-background: #f0faf8;
}

.downloads-bars .lui-bar-chart__grid-line {
  stroke: #a6c9c0;
}
```

### Variables

| Variable                                    | Default            | Description                                 |
| ------------------------------------------- | ------------------ | ------------------------------------------- |
| `--lui-bar-chart-min-width`                 | `280px`            | Narrowest the chart gets.                   |
| `--lui-bar-chart-axis-font-size`            | `12px`             | Axis label and title text size.             |
| `--lui-bar-chart-axis-color`                | Muted text color   | Axis label and title color.                 |
| `--lui-bar-chart-axis-line-color`           | Border color       | Axis line color.                            |
| `--lui-bar-chart-grid-color`                | Muted border color | Grid line color.                            |
| `--lui-bar-chart-label-font-size`           | `12px`             | Value label text size.                      |
| `--lui-bar-chart-label-weight`              | `600`              | Value label weight.                         |
| `--lui-bar-chart-label-color`               | Text color         | Value label color.                          |
| `--lui-bar-chart-wick-color`                | Text color         | Candlestick wick color.                     |
| `--lui-bar-chart-wick-width`                | `1.5`              | Candlestick wick thickness.                 |
| `--lui-bar-chart-reference-fill`            | Muted red          | Reference area fill.                        |
| `--lui-bar-chart-reference-opacity`         | `0.4`              | Reference area opacity, 0 to 1.             |
| `--lui-bar-chart-reference-label-color`     | Red text color     | Reference area label color.                 |
| `--lui-bar-chart-reference-label-font-size` | `12px`             | Reference area label text size.             |
| `--lui-bar-chart-reference-line-color`      | Red text color     | Reference line color.                       |
| `--lui-bar-chart-legend-gap`                | `12px`             | Space between items in a bottom legend.     |
| `--lui-bar-chart-side-legend-gap`           | `8px`              | Space between items in a top-right legend.  |
| `--lui-bar-chart-legend-item-gap`           | `4px`              | Space between a legend swatch and its name. |
| `--lui-bar-chart-legend-font-size`          | `12px`             | Legend text size.                           |
| `--lui-bar-chart-legend-color`              | Muted text color   | Legend text color.                          |
| `--lui-bar-chart-legend-swatch-size`        | `8px`              | Legend swatch width and height.             |
| `--lui-bar-chart-legend-swatch-radius`      | `2px`              | Legend swatch corner radius.                |
| `--lui-bar-chart-tooltip-padding`           | `8px 10px`         | Space inside the tooltip.                   |
| `--lui-bar-chart-tooltip-background`        | Panel color        | Tooltip background.                         |
| `--lui-bar-chart-tooltip-border`            | Border color       | Tooltip border color.                       |
| `--lui-bar-chart-tooltip-radius`            | `6px`              | Tooltip corner radius.                      |
| `--lui-bar-chart-tooltip-shadow`            | Small shadow       | Tooltip shadow.                             |
| `--lui-bar-chart-tooltip-font-size`         | `12px`             | Tooltip text size.                          |

Grid variables are in [Cartesian Grid](cartesian-grid.md).

### Classes

Root: `.lui-bar-chart`.

Parts, each prefixed with `.lui-bar-chart__`: `svg`, `axes`, `grid-line`,
`axis-line`, `tick`, `axis-label`, `references`, `reference-area`,
`reference-label`, `reference-line`, `marks`, `mark`, `bar`, `wick`,
`bar-label`, `legend`, `legend-item`, `legend-swatch`, `tooltip`,
`tooltip-label`, `tooltip-item`.

Root attributes, for use in selectors:

| Attribute               | Value                                             |
| ----------------------- | ------------------------------------------------- |
| `data-orientation`      | `vertical` or `horizontal`.                       |
| `data-legend-placement` | `bottom` or `top-right`, when the legend is on.   |
| `data-interactive`      | Present when the tooltip is on and there is data. |
| `data-unstyled`         | Present when `unstyled` is set.                   |
