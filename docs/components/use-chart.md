# useChart

`useChart` is an optional hook that holds a chart's data and series. Its
helpers sum values, find the minimum and maximum, format numbers and dates, and
look up theme colors.

## Usage

```tsx
import { useChart } from '@leverui/components';
```

```tsx
const chart = useChart({
  data: [
    { date: '2024-01-01', revenue: 1000 },
    { date: '2024-01-02', revenue: 2000 },
    { date: '2024-01-03', revenue: 3000 },
  ],
  series: [{ name: 'revenue', color: 'blue.500' }],
});
```

### Series labels

`label` is the name shown in the legend and the tooltip. Without it, they show
`name`.

```tsx
const chart = useChart({
  data,
  series: [{ name: 'revenue', label: 'Revenue', color: 'blue.500' }],
});
```

### Dynamic data

Passing the options directly reads the data once. If the data can change
later, such as rows loaded from a server or filtered by the user, wrap the
options in a function. `useChart` then reads them again on every change, and
the chart redraws.

```tsx
const [rows, setRows] = createSignal([{ date: '2024-01-01', revenue: 1000 }]);

// Redraws every time setRows runs.
const chart = useChart(() => ({
  data: rows(),
  series: [{ name: 'revenue', color: 'blue.500' }],
}));
```

Without the function, `rows()` is read only when the chart is created, and
later changes never reach it.

```tsx
// Stays on the first rows forever.
const chart = useChart({
  data: rows(),
  series: [{ name: 'revenue', color: 'blue.500' }],
});
```

## Series

### `getKey`

Returns a field name that TypeScript checks. `chart.key` is the same helper.

```tsx
const key = chart.getKey('revenue'); // 'revenue'
```

## Aggregation

### `getTotal`

```tsx
console.log(chart.getTotal('revenue')); // 6000
```

### `getMin`

```tsx
console.log(chart.getMin('revenue')); // 1000
```

### `getMax`

```tsx
console.log(chart.getMax('revenue')); // 3000
```

### `getValuePercent`

A value as a percentage of the total for its field.

```tsx
const percentage = chart.getValuePercent('revenue', 3000);
console.log(percentage); // 50
```

Pass a range as the third argument to measure against it.

```tsx
console.log(chart.getValuePercent('revenue', 2000, [0, 4000])); // 50
```

The range can also be a function. It gets the field's smallest and largest
values as `{ min, max }` and returns the range.

## Formatting

### `formatNumber`

Takes any `Intl.NumberFormatOptions`.

```tsx
const format = chart.formatNumber({ style: 'currency', currency: 'USD' });
console.log(format(1000)); // "$1,000.00"
```

### `formatDate`

Takes any `Intl.DateTimeFormatOptions`.

```tsx
const formatDate = chart.formatDate({ year: 'numeric', month: 'short' });
console.log(formatDate('2024-03-28')); // "Mar 2024"
```

A date with no time, such as `2024-03-28`, shows as that day in every time
zone. A date with a time shows in the reader's time zone, unless you pass
`timeZone`.

Both helpers use the locale of the nearest
[`LocaleProvider`](locale-provider.md), or `en-US` without one.

## Design tokens

Use these to give a chart a color, size, or spacing from the theme. Token
names such as `blue.500` are built in. A token name becomes its CSS variable.
A plain CSS value, such as `#ccc` or `2rem`, is returned as is.

A color token is a palette and a shade: `blue.500` is the `blue` palette,
shade `500`, which is `--lui-colors-blue-500`. See every color on the
[Colors](../colors.md) page. Sizes and spacing are listed in the
[size](../theme-variables/sizes.md) and
[spacing](../theme-variables/spacing.md) references.

To add a color of your own, define its variable in CSS, then pass its name:
`--lui-colors-brand-500` is `brand.500`.

### `color`

```tsx
chart.color('blue.500'); // var(--lui-colors-blue-500)
chart.color('#ccc'); // #ccc
```

### `size`

```tsx
const chartSize = chart.size('4'); // var(--lui-sizes-4)
```

### `spacing`

```tsx
const chartPadding = chart.spacing('4'); // var(--lui-spacing-4)
```

## Sorting

`direction` is `asc` or `desc`. Numbers sort by value, everything else as text.

```tsx
const chart = useChart({
  data: [
    { date: '2024-01-01', revenue: 1000 },
    { date: '2024-01-02', revenue: 2000 },
    { date: '2024-01-03', revenue: 3000 },
  ],
  sort: { by: 'date', direction: 'asc' },
  series: [{ name: 'revenue', color: 'blue.500' }],
});
```

`chart.data` holds the sorted rows.

## Highlighting

The chart object remembers one highlighted series.

### `highlightedSeries`

Name of the highlighted series, or `null`.

### `setHighlightedSeries`

Pass `null` to clear it.

```tsx
chart.setHighlightedSeries('revenue');
```

### `isHighlightedSeries`

```tsx
const isActive = chart.isHighlightedSeries('revenue'); // true
```

### `getSeriesOpacity`

`1` for the highlighted series, `0.2` for the others, `undefined` when nothing
is highlighted. A second argument replaces `0.2`.

```tsx
chart.setHighlightedSeries('revenue');

chart.getSeriesOpacity('revenue'); // 1
chart.getSeriesOpacity('costs'); // 0.2
```

## All helpers

| Helper                                | Purpose                                    |
| ------------------------------------- | ------------------------------------------ |
| `id`                                  | Unique ID for this chart.                  |
| `data`                                | Chart data, sorted if you set `sort`.      |
| `series`                              | Series you passed in.                      |
| `key(name)`, `getKey(name)`           | Field name, checked by TypeScript.         |
| `getSeries(name)`                     | Details of one series.                     |
| `getSeriesOpacity(name, fallback)`    | Opacity to draw a series with.             |
| `groupBy(key)`                        | Rows split into groups that share a value. |
| `getTotal(key)`                       | Sum of a field.                            |
| `getMin(key)`                         | Smallest value of a field.                 |
| `getMax(key)`                         | Largest value of a field.                  |
| `getValuePercent(key, value, domain)` | A value as a percentage.                   |
| `formatNumber(options)`               | Function that formats numbers.             |
| `formatDate(options)`                 | Function that formats date strings.        |
| `color(key)`                          | CSS variable for a color token.            |
| `size(key)`                           | CSS variable for a size token.             |
| `spacing(key)`                        | CSS variable for a spacing token.          |
| `highlightedSeries`                   | Name of the highlighted series, or `null`. |
| `setHighlightedSeries(name)`          | Set the highlighted series.                |
| `isHighlightedSeries(name)`           | Whether a series is highlighted.           |
