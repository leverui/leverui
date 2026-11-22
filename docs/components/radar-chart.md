# Radar Chart

Compares several measures at once on a shape around a center point.

```tsx
import { RadarChart } from '@leverui/components';
```

```tsx
<RadarChart
  data={[
    { label: 'January', windows: 110 },
    { label: 'February', windows: 130 },
    { label: 'March', windows: 110 },
  ]}
  series={[{ name: 'windows', color: 'teal.solid' }]}
  radiusLabels
  aria-label="Monthly operating-system use"
/>
```

## Props

### Data

| Prop       | Default | Type                     | Description                       |
| ---------- | ------- | ------------------------ | --------------------------------- |
| `data`     | —       | `readonly RadarDatum[]`  | Rows, one per category. Required. |
| `series`   | —       | `readonly RadarSeries[]` | Number fields to draw. Required.  |
| `maxValue` | —       | `number`                 | Number at the outer edge.         |

The chart needs at least three rows to draw a shape.

Without `maxValue`, the largest value is rounded up to a multiple of 20. A
`maxValue` of zero or less is ignored.

A value that is negative or not a number is drawn at the center. A value above
`maxValue` is drawn at the outer edge.

### Shapes

| Prop          | Default | Type      | Description                    |
| ------------- | ------- | --------- | ------------------------------ |
| `linesOnly`   | `false` | `boolean` | Draw outlines only, no fill.   |
| `dots`        | `false` | `boolean` | Draw a dot at each value.      |
| `pointLabels` | `false` | `boolean` | Print each value at its point. |

### Grid and labels

| Prop           | Default   | Type                                | Description                           |
| -------------- | --------- | ----------------------------------- | ------------------------------------- |
| `grid`         | `polygon` | `'polygon' \| 'circle' \| 'filled'` | Grid style.                           |
| `angleLabels`  | `true`    | `boolean`                           | Show category names around the chart. |
| `radiusLabels` | `false`   | `boolean`                           | Show scale numbers, center to edge.   |

`grid` values: `polygon` (four rings with straight sides, plus spokes),
`circle` (four round rings, plus spokes), `filled` (tinted rings, no ring lines
or spokes).

### Legend and tooltip

| Prop      | Default | Type      | Description                                                              |
| --------- | ------- | --------- | ------------------------------------------------------------------------ |
| `legend`  | `false` | `boolean` | Show a legend below the shapes.                                          |
| `tooltip` | `false` | `boolean` | Show values for the category nearest the pointer. Turns on keyboard use. |

The legend sits inside the chart's height, so the shapes are drawn a little
smaller. It lists the series in reverse order.

### Size

| Prop     | Default | Type     | Description        |
| -------- | ------- | -------- | ------------------ |
| `width`  | `384`   | `number` | Width, in pixels.  |
| `height` | `288`   | `number` | Height, in pixels. |

The chart keeps its shape when it shrinks to fit a narrower container.

Other attributes and event handlers go to the root element. Without
`aria-label`, the chart is announced as "Radar chart".

## Data rows

| Field         | Type     | Description                                                 |
| ------------- | -------- | ----------------------------------------------------------- |
| `label`       | `string` | Category name. Required.                                    |
| Any other key | `number` | Value for one series. The key must match the series `name`. |

## Series options

| Field   | Type     | Description                                                                   |
| ------- | -------- | ----------------------------------------------------------------------------- |
| `name`  | `string` | Number field in your data. Also the name in the legend and tooltip. Required. |
| `color` | `string` | Color token such as `teal.solid`, or a CSS color. Required.                   |

## Keyboard

The chart takes focus when `tooltip` is on. Focus shows the tooltip for the
first category.

| Key                      | Action                     |
| ------------------------ | -------------------------- |
| `ArrowLeft` `ArrowRight` | Previous or next category. |
| `Escape`                 | Close the tooltip.         |

Your own `onFocus`, `onBlur`, and `onKeyDown` handlers run after the chart's.

## Styling

```tsx
<RadarChart class="usage-radar" data={data} series={series} legend />
```

```css
.usage-radar {
  --leverui-radar-chart-grid-stroke: #a6c9c0;
  --leverui-radar-chart-series-fill-opacity: 0.35;
}

.usage-radar .leverui-radar-chart__angle-label {
  font-weight: 600;
}
```

### Variables

| Variable                                     | Default            | Description                                            |
| -------------------------------------------- | ------------------ | ------------------------------------------------------ |
| `--leverui-radar-chart-width`                | The `width` prop   | Displayed width.                                       |
| `--leverui-radar-chart-max-width`            | `100%`             | Widest the chart gets.                                 |
| `--leverui-radar-chart-margin`               | `auto`             | Margin around the chart. `auto` centers it.            |
| `--leverui-radar-chart-grid-stroke`          | Border color       | Grid line color.                                       |
| `--leverui-radar-chart-grid-stroke-width`    | `1px`              | Grid line thickness.                                   |
| `--leverui-radar-chart-grid-fill`            | `teal.solid` color | Ring tint when `grid` is `filled`.                     |
| `--leverui-radar-chart-grid-fill-opacity`    | `0.1`              | Opacity of that tint, 0 to 1.                          |
| `--leverui-radar-chart-label-font-size`      | `12px`             | Text size of every label.                              |
| `--leverui-radar-chart-angle-label-color`    | Muted text color   | Category name color.                                   |
| `--leverui-radar-chart-radius-label-color`   | `#ccc`             | Scale number color.                                    |
| `--leverui-radar-chart-point-label-color`    | Text color         | Color of the `pointLabels` values.                     |
| `--leverui-radar-chart-series-stroke-width`  | `1px` or `2px`     | Shape outline thickness.                               |
| `--leverui-radar-chart-series-fill-opacity`  | `0.2`              | Shape fill opacity, 0 to 1.                            |
| `--leverui-radar-chart-legend-gap`           | `12px`             | Space between legend items.                            |
| `--leverui-radar-chart-legend-overlap`       | `-33px`            | Legend top margin. Pulls the legend up into the chart. |
| `--leverui-radar-chart-legend-padding`       | `5px 0`            | Space inside the legend.                               |
| `--leverui-radar-chart-legend-color`         | Muted text color   | Legend text color.                                     |
| `--leverui-radar-chart-legend-font-size`     | `12px`             | Legend text size.                                      |
| `--leverui-radar-chart-legend-item-gap`      | `4px`              | Space between a swatch and its name.                   |
| `--leverui-radar-chart-legend-swatch-size`   | `8px`              | Swatch width and height.                               |
| `--leverui-radar-chart-legend-swatch-radius` | `2px`              | Swatch corner radius.                                  |

The outline is `2px` when `linesOnly` is on or there is more than one series.
Otherwise it is `1px`.

`--leverui-radar-chart-width` changes the displayed width, not what is drawn.
The `width` and `height` props still set the proportions.

| Variable                            | Default       | Description               |
| ----------------------------------- | ------------- | ------------------------- |
| `--leverui-chart-tooltip-bg`        | Panel color   | Tooltip background.       |
| `--leverui-chart-tooltip-padding`   | `4px 10px`    | Space inside the tooltip. |
| `--leverui-chart-tooltip-gap`       | `4px`         | Space between rows.       |
| `--leverui-chart-tooltip-radius`    | `4px`         | Tooltip corner radius.    |
| `--leverui-chart-tooltip-shadow`    | Medium shadow | Tooltip shadow.           |
| `--leverui-chart-tooltip-font-size` | `12px`        | Tooltip text size.        |

### Classes

Root: `.leverui-radar-chart`.

Parts, each prefixed with `.leverui-radar-chart__`: `svg`, `grid`, `ring`,
`spoke`, `angle-label`, `radius-label`, `series`, `shape`, `point`,
`point-dot`, `point-label`, `legend`, `legend-item`, `legend-swatch`.

Tooltip: `.leverui-chart-tooltip`. Parts, each prefixed with
`.leverui-chart-tooltip__`: `label`, `item`, `swatch`, `values`, `name`,
`value`.

Part attributes:

- `data-grid` on the grid: the value of `grid`.
- `data-radar-series` on each series: the series `name`.
- `data-radar-point` on each point: the row's position, starting at 0.
