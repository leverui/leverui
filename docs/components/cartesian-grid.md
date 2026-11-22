# Cartesian Grid

The grid lines behind the line, area, bar, and scatter charts.

## Usage

```tsx
import { LineChart } from '@leverui/components';
```

```tsx
<LineChart showGrid />
```

On by default: a light gray line at each Y-axis value.

`AreaChart` takes the same props. `BarChart` takes `showGrid`, `gridDashed` and
the CSS variables, and uses `verticalGrid` in place of `gridVertical`.

## Customize stroke

Set these on the chart or any element that contains it.

```css
.sales-chart {
  --leverui-chart-grid-color: #ccc;
  --leverui-chart-grid-dasharray: 3 3;
  --leverui-chart-grid-opacity: 0.5;
}
```

| Variable                         | Default      | Description                          |
| -------------------------------- | ------------ | ------------------------------------ |
| `--leverui-chart-grid-color`     | Border color | Line color, such as `#ddd` or `red`. |
| `--leverui-chart-grid-dasharray` | `none`       | Dash pattern, such as `5 5`.         |
| `--leverui-chart-grid-opacity`   | `1`          | Line opacity, 0 to 1.                |

`gridDashed` draws `3 3` dashes without CSS.

```tsx
<LineChart gridDashed />
```

## Show/hide grid lines

```tsx
<LineChart gridVertical gridHorizontal />
```

`gridHorizontal` is on by default, with a line at each Y-axis value.
`gridVertical` is off by default, with a line at each category. For vertical
lines only, add `gridHorizontal={false}`.

## Remove grid lines

```tsx
<LineChart showGrid={false} />
```
