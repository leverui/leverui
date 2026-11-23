# Sparkline

A sparkline is a small chart with no axes or labels that shows a trend at a
glance. Put one beside a number, such as in a stat card or a table row.

```tsx
import { Sparkline } from '@leverui/components';
```

```tsx
<Sparkline
  data={[{ value: 10 }, { value: 16 }, { value: 19 }, { value: 15 }]}
  aria-label="Values over time"
/>
```

## Props

### Data

| Prop   | Default | Type                       | Description               |
| ------ | ------- | -------------------------- | ------------------------- |
| `data` | —       | `readonly SparklineData[]` | Points to draw. Required. |

The scale starts at zero. A value below zero is drawn at zero.

### Look

| Prop          | Default      | Type                        | Description                                       |
| ------------- | ------------ | --------------------------- | ------------------------------------------------- |
| `type`        | `area`       | `'area' \| 'line' \| 'bar'` | Kind of chart.                                    |
| `color`       | `teal.solid` | `string`                    | Color token such as `teal.solid`, or a CSS color. |
| `gradient`    | `false`      | `boolean`                   | Fade the area fill toward the bottom.             |
| `fillOpacity` | `0.2`        | `number`                    | Area fill opacity, 0 to 1.                        |
| `smooth`      | `false`      | `boolean`                   | Round the line through the points.                |
| `reference`   | `false`      | `boolean`                   | Dashed lines at the lowest and highest values.    |
| `unstyled`    | `false`      | `boolean`                   | Turn off default styles. Shapes stay.             |

With `gradient`, `fillOpacity` defaults to `0.6`.

`reference` also prints the two values, the lowest just outside the left edge
and the highest just outside the right. Leave room for them.

### Size

| Prop     | Default | Type               | Description                                     |
| -------- | ------- | ------------------ | ----------------------------------------------- |
| `width`  | `112`   | `number \| string` | Width in pixels, or a CSS width such as `100%`. |
| `height` | `48`    | `number`           | Height, in pixels.                              |
| `inset`  | `5`     | `number`           | Space between the edge and the plot, in pixels. |

With a CSS width such as `width="100%"`, the chart follows its container.

Set `inset={0}` to reach the edges of the container, as in a statistic card. A
negative `inset`, or one that leaves no room for the plot, throws an error.

### Interaction

| Prop                  | Default | Type                              | Description                               |
| --------------------- | ------- | --------------------------------- | ----------------------------------------- |
| `activeIndex`         | —       | `number \| null`                  | Mark this point with a line and a dot.    |
| `onActiveIndexChange` | —       | `(index: number \| null) => void` | Runs as the pointer moves over the chart. |

`onActiveIndexChange` gets the index of the point nearest the pointer, or
`null` when the pointer leaves.

```tsx
const [active, setActive] = createSignal<number | null>(null);

<Sparkline
  data={data}
  activeIndex={active()}
  onActiveIndexChange={setActive}
  aria-label="Weekly downloads"
/>;
```

`class`, `className`, `style` and `ref` go to the `<svg>` element.

## Data points

| Field   | Type     | Description                                             |
| ------- | -------- | ------------------------------------------------------- |
| `value` | `number` | Number to draw. Required.                               |
| `fill`  | `string` | Color token or CSS color for this bar. Bar charts only. |

```tsx
<Sparkline
  type="bar"
  data={[{ value: 10 }, { value: 16 }, { value: 19, fill: 'red.solid' }]}
  aria-label="Values over time"
/>
```

## Styling

```tsx
<Sparkline class="visitors-sparkline" data={data} />
```

```css
.visitors-sparkline {
  --lui-sparkline-line-width: 1.5;
  --lui-sparkline-reference-color: #a6c9c0;
}
```

### Variables

| Variable                              | Default                 | Description                      |
| ------------------------------------- | ----------------------- | -------------------------------- |
| `--lui-sparkline-width`               | `112px`                 | Chart width.                     |
| `--lui-sparkline-height`              | `48px`                  | Chart height.                    |
| `--lui-sparkline-color`               | Solid teal              | Line, fill and bar color.        |
| `--lui-sparkline-area-opacity`        | `0.2`                   | Area fill opacity.               |
| `--lui-sparkline-line-width`          | `2`                     | Line thickness.                  |
| `--lui-sparkline-reference-color`     | Emphasized border color | Reference line color.            |
| `--lui-sparkline-label-color`         | Muted text color        | Reference value color.           |
| `--lui-sparkline-active-point-stroke` | Background color        | Outline color of the active dot. |

The `color`, `width`, `height` and `fillOpacity` props set the matching
variable, so a prop wins over a variable set in CSS.

### Classes

Root: `.leverui-sparkline`.

Parts, each prefixed with `.leverui-sparkline__`: `area`, `line`, `bar`,
`reference-line`, `reference-label`, `active-guide`, `active-point`,
`gradient-start`, `gradient-end`.
