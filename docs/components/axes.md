# Axis

The X and Y axes of the line, area, bar, and scatter charts: their ticks,
labels, and range.

## X-axis

`AreaChart` takes the same props as `LineChart`. `chart` comes from
[`useChart`](use-chart.md).

### Custom tick formatting

Turn a date such as `2024-03-28` into `Mar`:

```tsx
<LineChart xKey="date" xTickFormatter={chart.formatDate({ month: 'short' })} />
```

### Rotate X-axis labels

Set `xTickAngle` in degrees and make room below with `plotMargin`.

```tsx
<LineChart xKey="name" xTickAngle={-45} plotMargin={{ bottom: 60 }} />
```

### Adjust X-axis padding

In pixels.

```tsx
<LineChart xKey="name" xPadding={{ left: 20, right: 20 }} />
```

### Hide X-axis

```tsx
<LineChart showXAxis={false} />
```

### Custom X-axis labels

A title below the axis:

```tsx
<LineChart xKey="name" xAxisLabel="Category" />
```

Labels on only some categories:

```tsx
<LineChart xKey="month" xTickValues={['January', 'April', 'July']} />
```

## Y-axis

Hidden until you set `showYAxis`.

### Set domain

The first number must be lower than the second.

```tsx
<LineChart showYAxis yDomain={[0, chart.getMax('value') + 100]} />
```

Without `yDomain`, the axis fits the data and includes zero.

### Format labels

```tsx
<LineChart showYAxis yTickFormatter={(value) => `${value}%`} />
```

Without a formatter, values round to whole numbers.

### Adjust width

Room for the labels, in pixels. Default is 65, or 76 with an axis title.

```tsx
<LineChart showYAxis plotMargin={{ left: 50 }} />
```

### Hide Y-axis

```tsx
<LineChart showYAxis={false} />
```

### Custom grid lines

Set `yDomain` too, so the values fit on the axis.

```tsx
<LineChart showYAxis yDomain={[0, 1000]} yTickValues={[0, 250, 500, 750, 1000]} />
```

## Additional customizations

### Multiple X or Y axes

Set a series' `yAxis` to `right` for a second Y-axis. There is no second
X-axis.

```tsx
<LineChart
  showYAxis
  series={[
    { name: 'revenue', color: 'teal.solid' },
    { name: 'orders', color: 'purple.solid', yAxis: 'right' },
  ]}
  rightYAxisLabel="Orders"
/>
```

`rightYDomain` sets the right axis range. `yTickFormatter` and `yTickValues`
only change the left axis.

### Reference lines

Horizontal line at a value:

```tsx
<LineChart referenceValue={{ y: 1000, color: 'red.solid', label: 'Threshold' }} />
```

Vertical line at a category:

```tsx
<LineChart referenceLines={[{ x: 'March', label: 'Launch' }]} />
```

### Axis ticks and lines

Off by default.

```tsx
<LineChart showYAxis showAxisLines />
```

Set the color with `--lui-chart-axis-line-color`.
