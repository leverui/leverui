# Bar List

A ranked list where each row has a bar sized to its value, such as top pages by
visits.

```tsx
import { BarList, useChart } from '@leverui/components';
```

```tsx
function TrafficList() {
  const chart = useChart({
    data: [
      { name: 'Direct', value: 50 },
      { name: 'Referral', value: 25 },
    ],
    series: [{ name: 'name', color: 'teal.subtle' }],
  });

  return (
    <BarList.Root chart={chart}>
      <BarList.Title>Traffic</BarList.Title>
      <BarList.Content>
        <BarList.Label title="Source" flex="1">
          <BarList.Bar tooltip />
        </BarList.Label>
        <BarList.Label title="Visits">
          <BarList.Value />
        </BarList.Label>
      </BarList.Content>
    </BarList.Root>
  );
}
```

## Props

### Root

| Prop      | Default  | Type                          | Description                             |
| --------- | -------- | ----------------------------- | --------------------------------------- |
| `chart`   | —        | `UseChartReturn<BarListData>` | Value returned by `useChart`. Required. |
| `barSize` | `2.5rem` | `string`                      | Row height.                             |

`barSize` and the `minW` prop of `Label` take a spacing token such as `"12"`
(3rem) or a CSS length such as `"48px"`.

### Label

| Prop             | Default | Type               | Description                                       |
| ---------------- | ------- | ------------------ | ------------------------------------------------- |
| `title`          | —       | `JSX.Element`      | Column heading. Required.                         |
| `titleAlignment` | —       | `string`           | CSS `text-align` of the heading, such as `right`. |
| `flex`           | —       | `string \| number` | CSS `flex` of the column. `1` fills space.        |
| `minW`           | —       | `string`           | Narrowest the column gets.                        |

Optional column. Put a `Bar` or a `Value` inside it.

### Bar

| Prop      | Default | Type                  | Description                                   |
| --------- | ------- | --------------------- | --------------------------------------------- |
| `label`   | —       | `function`            | Render your own content in place of the name. |
| `tooltip` | `false` | `boolean \| function` | Show the row's value on hover and focus.      |

`label` gets `{ payload, index }`: the data row and its position in the list.
A `tooltip` function gets `{ payload }` and renders your own tooltip.

The largest value gets the longest bar. The others are sized against it.

### Value

| Prop             | Default | Type                             | Description         |
| ---------------- | ------- | -------------------------------- | ------------------- |
| `valueFormatter` | —       | `(value: number) => JSX.Element` | Format each number. |

Without `valueFormatter`, numbers are short, with up to two decimal places,
such as `1.25K`.

### Tooltip

| Prop             | Default | Type                             | Description                           |
| ---------------- | ------- | -------------------------------- | ------------------------------------- |
| `payload`        | —       | `BarListData`                    | Row the tooltip belongs to. Required. |
| `labelFormatter` | —       | `(value: number) => JSX.Element` | Format the value.                     |

`Bar` adds this part for you when `tooltip` is on. Without `labelFormatter`, it
shows the full number.

`Title` and `Content` have no props of their own. Other attributes and event
handlers go to each part's outer element.

## Data fields

| Field   | Type     | Description                                    |
| ------- | -------- | ---------------------------------------------- |
| `name`  | `string` | Name shown on the row. Required.               |
| `value` | `number` | Number the bar stands for. Required.           |
| `href`  | `string` | Link for the row. Read it in a custom `label`. |

Pass `sort` to [`useChart`](use-chart.md) to order the rows.

Bar color: add a `series` entry named `'name'` with a `color`, a token such as
`teal.subtle` or a CSS color. Default: `teal.subtle`.

## Keyboard

Each row takes focus when `tooltip` is on.

| Key   | Action                     |
| ----- | -------------------------- |
| `Tab` | Next row. Shows its value. |

## Styling

```tsx
<BarList.Root chart={chart} class="traffic-list">
  ...
</BarList.Root>
```

```css
.traffic-list {
  --lui-bar-list-size: 3rem;
}

.traffic-list .leverui-bar-list__fill {
  border-radius: 0.75rem;
}
```

### Variables

| Variable              | Default  | Description |
| --------------------- | -------- | ----------- |
| `--lui-bar-list-size` | `2.5rem` | Row height. |

`barSize` sets this variable on one list.

### Classes

Parts, each prefixed with `.leverui-bar-list__`: `root`, `title`, `content`,
`label`, `labelHeading`, `bar`, `row`, `fill`, `rowLabel`, `value`, `valueRow`,
`tooltip`.

A hovered or focused row has `data-hovered` and, by default, a light
background.
