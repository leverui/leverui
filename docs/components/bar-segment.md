# Bar Segment

One bar split into parts, showing how each part adds up to a total.

```tsx
import { BarSegment, useChart } from '@leverui/components';
```

```tsx
function TrafficMix() {
  const chart = useChart({
    data: [
      { name: 'Direct', value: 60, color: 'teal.solid' },
      { name: 'Referral', value: 40, color: 'blue.solid' },
    ],
  });

  return (
    <BarSegment.Root chart={chart}>
      <BarSegment.Content>
        <BarSegment.Value />
        <BarSegment.Bar tooltip>
          <BarSegment.Reference value={50} label="Target" />
        </BarSegment.Bar>
        <BarSegment.Label />
      </BarSegment.Content>
      <BarSegment.Legend showPercent />
    </BarSegment.Root>
  );
}
```

## Props

### Root

| Prop      | Default  | Type                             | Description                             |
| --------- | -------- | -------------------------------- | --------------------------------------- |
| `chart`   | —        | `UseChartReturn<BarSegmentData>` | Value returned by `useChart`. Required. |
| `barSize` | `2.5rem` | `string`                         | Bar height.                             |

Only `Root` is required.

`barSize` and the `gap` props take a spacing token such as `"10"` (2.5rem) or a
CSS length such as `"3rem"`.

### Bar

| Prop      | Default   | Type                  | Description                                         |
| --------- | --------- | --------------------- | --------------------------------------------------- |
| `tooltip` | `false`   | `boolean \| function` | Show a segment's name and value on hover and focus. |
| `gap`     | `0.25rem` | `string`              | Space between segments.                             |

A `tooltip` function gets `{ payload }`, the item from your data, and renders
your own tooltip.

### Reference

| Prop    | Default | Type          | Description                           |
| ------- | ------- | ------------- | ------------------------------------- |
| `value` | —       | `number`      | Marker position on the bar. Required. |
| `label` | —       | `JSX.Element` | Text next to the marker.              |

Put it inside `Bar`. `value` is measured against the total of your data: with a
total of 100, a `value` of 50 sits halfway along the bar.

### Legend

| Prop             | Default | Type                        | Description                               |
| ---------------- | ------- | --------------------------- | ----------------------------------------- |
| `showValue`      | `false` | `boolean`                   | Show each value after its name.           |
| `showPercent`    | `false` | `boolean`                   | Show each share as a whole percentage.    |
| `valueFormatter` | —       | `(value: number) => string` | Format each value when `showValue` is on. |
| `gap`            | `1rem`  | `string`                    | Space between legend items.               |
| `textStyle`      | `sm`    | `'xs' \| 'sm'`              | Legend text size.                         |

### Tooltip

| Prop      | Default | Type             | Description                            |
| --------- | ------- | ---------------- | -------------------------------------- |
| `payload` | —       | `BarSegmentData` | Item the tooltip belongs to. Required. |

`Bar` adds this part for you when `tooltip` is on.

`Content`, `Value`, and `Label` have no props of their own. `Value` prints each
number and `Label` each name, in line with its segment. Other attributes and
event handlers go to each part's outer element.

`Content` closes the tooltip when the pointer leaves it. Your own
`onMouseLeave` handler runs after that.

## Data fields

| Field   | Type     | Description                                                 |
| ------- | -------- | ----------------------------------------------------------- |
| `name`  | `string` | Segment name. Required.                                     |
| `value` | `number` | Segment size. Required.                                     |
| `color` | `string` | Color token such as `teal.solid`, or a CSS color. Required. |

Pass `sort` to [`useChart`](use-chart.md) to order the segments.

## Keyboard

Each segment takes focus when `tooltip` is on. A screen reader reads its name
and value.

| Key   | Action                           |
| ----- | -------------------------------- |
| `Tab` | Next segment. Shows its tooltip. |

## Styling

```tsx
<BarSegment.Root chart={chart} class="traffic-mix">
  ...
</BarSegment.Root>
```

```css
.traffic-mix {
  --lui-bar-segment-size: 3rem;
  --lui-bar-segment-bar-gap: 0.5rem;
}

.traffic-mix .leverui-bar-segment__segment {
  border-radius: 0.75rem;
}
```

### Variables

| Variable                        | Default   | Description                                       |
| ------------------------------- | --------- | ------------------------------------------------- |
| `--lui-bar-segment-size`        | `2.5rem`  | Bar height.                                       |
| `--lui-bar-segment-root-gap`    | `1rem`    | Space between the content and the legend.         |
| `--lui-bar-segment-content-gap` | `0.25rem` | Space between the values, the bar, and the names. |
| `--lui-bar-segment-row-gap`     | `0.5rem`  | Space between items in the value and name rows.   |
| `--lui-bar-segment-bar-gap`     | `0.25rem` | Space between segments.                           |
| `--lui-bar-segment-legend-gap`  | `1rem`    | Space between legend items.                       |

`barSize` sets the size variable on one chart. `gap` on `Bar` and `Legend` sets
the gap variable for that part.

### Classes

Parts, each prefixed with `.leverui-bar-segment__`: `root`, `content`, `value`,
`valueItem`, `bar`, `segment`, `reference`, `referenceLine`, `referenceLabel`,
`label`, `labelItem`, `legend`, `legendItem`, `legendSwatch`, `legendText`,
`legendPercent`, `tooltip`, `tooltipSwatch`.
