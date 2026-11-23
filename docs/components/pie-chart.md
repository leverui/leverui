# Pie Chart

Shows how parts make up a whole, as slices of a circle.

```tsx
import { RadialChart } from '@leverui/components';
```

```tsx
<RadialChart
  data={[
    { name: 'Solid', value: 60, color: 'teal.solid' },
    { name: 'Other', value: 40, color: 'blue.solid' },
  ]}
  aria-label="Framework share"
/>
```

There is no `PieChart` or `DonutChart` export. Leave `innerRadius` out for a
pie. Set it above zero for a [Donut Chart](donut-chart.md).

## Props

### Data

| Prop   | Default | Type                     | Description               |
| ------ | ------- | ------------------------ | ------------------------- |
| `data` | —       | `readonly RadialDatum[]` | Slices to draw. Required. |

### Slices

| Prop           | Default   | Type      | Description                                             |
| -------------- | --------- | --------- | ------------------------------------------------------- |
| `innerRadius`  | `0`       | `number`  | Hole radius, in pixels. Leave at zero for a pie.        |
| `outerRadius`  | See below | `number`  | Pie radius, in pixels.                                  |
| `startAngle`   | `0`       | `number`  | Start of the first slice, in degrees.                   |
| `endAngle`     | `360`     | `number`  | End of the last slice, in degrees.                      |
| `paddingAngle` | `0`       | `number`  | Gap after each slice, in degrees.                       |
| `cornerRadius` | `0`       | `number`  | Round the slice corners. Needs a hole, so not on a pie. |
| `stroke`       | `white`   | `string`  | Slice outline color. A CSS color, or `none`.            |
| `strokeWidth`  | `1`       | `number`  | Slice outline thickness.                                |
| `detached`     | `false`   | `boolean` | Push the hovered or focused slice out 20 pixels.        |

Without `outerRadius`, the radius is 40% of `size` after 10 pixels are taken
off: 76 at the default size. A legend takes off another 28 pixels.

Angle 0 points right, at 3 o'clock. Angles grow counterclockwise.
`startAngle={180}` with `endAngle={0}` draws a half pie across the top.

### Labels and center text

| Prop                | Default | Type                               | Description                                          |
| ------------------- | ------- | ---------------------------------- | ---------------------------------------------------- |
| `label`             | —       | `'inside' \| 'outside' \| 'point'` | Label on each slice.                                 |
| `labelFormatter`    | —       | `function`                         | Format each label.                                   |
| `centerTitle`       | —       | `string`                           | Large text at the center.                            |
| `centerDescription` | —       | `string`                           | Small text below `centerTitle`. Needs `centerTitle`. |

`label` values: `inside` (middle of the slice), `outside` (just past the outer
edge), `point` (past the outer edge, in bold, at the end of a short line).

Labels show `name` by default. `labelFormatter` gets the data item and its
share of the total, 0 to 1, and returns the text.

```tsx
<RadialChart
  data={data}
  outerRadius={80}
  label="outside"
  labelFormatter={(item, share) => `${item.name} ${(share * 100).toFixed(1)}%`}
/>
```

Labels past the outer edge need room: a larger `size`, a smaller `outerRadius`,
or `plotOffsetX`.

`centerTitle` and `centerDescription` are meant for a donut. On a pie the text
is drawn on top of the slices.

### Legend and tooltip

| Prop      | Default | Type      | Description                                          |
| --------- | ------- | --------- | ---------------------------------------------------- |
| `legend`  | `false` | `boolean` | Show a legend along the bottom.                      |
| `tooltip` | `false` | `boolean` | Show name and value of the hovered or focused slice. |

The legend lists items in the reverse order of `data`.

### Size

| Prop          | Default | Type     | Description                                         |
| ------------- | ------- | -------- | --------------------------------------------------- |
| `size`        | `200`   | `number` | Width and height, in pixels.                        |
| `plotOffsetX` | `0`     | `number` | Move the pie right, in pixels. Negative moves left. |

The chart shrinks to fit a narrower container.

Other attributes and event handlers go to the root element. Without
`aria-label`, the chart is announced as "Radial chart".

## Data items

| Field   | Type     | Description                                                 |
| ------- | -------- | ----------------------------------------------------------- |
| `name`  | `string` | Name in labels, the legend and the tooltip. Required.       |
| `value` | `number` | Slice size, compared with the others. Required.             |
| `color` | `string` | Color token such as `teal.solid`, or a CSS color. Required. |

Only an item with a finite `value` above zero gets a slice.

## Keyboard

Each slice takes focus and is announced with its name and value. With `tooltip`
on, a focused slice shows its tooltip.

| Key               | Action                  |
| ----------------- | ----------------------- |
| `Tab` `Shift+Tab` | Next or previous slice. |
| `Escape`          | Close the tooltip.      |

## Styling

```tsx
<RadialChart class="share-pie" data={data} label="inside" legend />
```

```css
.share-pie {
  --lui-radial-chart-sector-stroke: #f0faf8;
  --lui-radial-chart-legend-gap: 1rem;
}

.share-pie .leverui-radial-chart__label {
  font-weight: 600;
}
```

### Variables

| Variable                                          | Default               | Description                            |
| ------------------------------------------------- | --------------------- | -------------------------------------- |
| `--lui-radial-chart-sector-stroke`                | `white`               | Slice outline color.                   |
| `--lui-radial-chart-sector-stroke-width`          | `1`                   | Slice outline thickness.               |
| `--lui-radial-chart-inside-label-color`           | `white`               | Color of `inside` labels.              |
| `--lui-radial-chart-outside-label-color`          | Muted text color      | Color of `outside` and `point` labels. |
| `--lui-radial-chart-label-font-size`              | `12px`                | Label text size.                       |
| `--lui-radial-chart-label-line-color`             | Stronger border color | Color of the line to a `point` label.  |
| `--lui-radial-chart-center-color`                 | Text color            | Color of `centerTitle`.                |
| `--lui-radial-chart-center-title-font-size`       | `32px`                | Text size of `centerTitle`.            |
| `--lui-radial-chart-center-description-color`     | Muted text color      | Color of `centerDescription`.          |
| `--lui-radial-chart-center-description-font-size` | `12px`                | Text size of `centerDescription`.      |
| `--lui-radial-chart-legend-gap`                   | `12px`                | Space between legend items.            |
| `--lui-radial-chart-legend-font-size`             | `12px`                | Legend text size.                      |
| `--lui-radial-chart-legend-item-gap`              | `5px`                 | Space between a swatch and its name.   |
| `--lui-radial-chart-legend-swatch-size`           | `8px`                 | Swatch width and height.               |
| `--lui-radial-chart-legend-swatch-radius`         | `2px`                 | Swatch corner radius.                  |

The `stroke` and `strokeWidth` props win over the two slice variables.

| Variable                        | Default       | Description               |
| ------------------------------- | ------------- | ------------------------- |
| `--lui-chart-tooltip-bg`        | Panel color   | Tooltip background.       |
| `--lui-chart-tooltip-padding`   | `4px 10px`    | Space inside the tooltip. |
| `--lui-chart-tooltip-gap`       | `4px`         | Space between rows.       |
| `--lui-chart-tooltip-radius`    | `4px`         | Tooltip corner radius.    |
| `--lui-chart-tooltip-shadow`    | Medium shadow | Tooltip shadow.           |
| `--lui-chart-tooltip-font-size` | `12px`        | Tooltip text size.        |

### Classes

Root: `.leverui-radial-chart`.

Parts, each prefixed with `.leverui-radial-chart__`: `svg`, `sector`, `labels`,
`labelLine`, `label`, `center`, `centerTitle`, `centerDescription`, `legend`,
`legendItem`, `legendSwatch`.

Tooltip: `.leverui-chart-tooltip`. Parts, each prefixed with
`.leverui-chart-tooltip__`: `item`, `swatch`, `values`, `name`, `value`.

Root attributes:

- `data-chart-shape`: `pie` with no hole, `donut` with one.
- `data-label-placement`: the value of `label`.
- `data-legend`: present when `legend` is on.
- `data-detached`: present when `detached` is on.
