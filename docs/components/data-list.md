# Data List

A list of labels and values, such as the details of an order.

```tsx
import { DataList } from '@leverui/components';
```

```tsx
<DataList.Root>
  <For each={data}>
    {(item) => (
      <DataList.Item>
        <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
        <DataList.ItemValue>{item.value}</DataList.ItemValue>
      </DataList.Item>
    )}
  </For>
</DataList.Root>
```

## Closed Component

Wrap the parts in your own component so each item takes a few props. Uses
[`InfoTip`](toggle-tip.md).

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { DataList, InfoTip } from '@leverui/components';

export const DataListRoot = DataList.Root;

export interface ClosedDataListItemProps {
  label: JSX.Element;
  value: JSX.Element;
  info?: JSX.Element | undefined;
  grow?: boolean | undefined;
  children?: JSX.Element | undefined;
  class?: string | undefined;
  style?: JSX.CSSProperties | undefined;
}

export function DataListItem(props: ClosedDataListItemProps) {
  const rest = omit(props, 'label', 'value', 'info', 'grow', 'children');
  const flex = (): JSX.CSSProperties | undefined => (props.grow ? { flex: '1' } : undefined);

  return (
    <DataList.Item {...rest}>
      <DataList.ItemLabel style={flex()}>
        {props.label}
        <Show when={props.info}>
          <InfoTip>{props.info}</InfoTip>
        </Show>
      </DataList.ItemLabel>
      <DataList.ItemValue style={flex()}>{props.value}</DataList.ItemValue>
      {props.children}
    </DataList.Item>
  );
}
```

```tsx
<DataListRoot orientation="horizontal">
  <DataListItem label="Status" value="Active" info="Updated hourly" />
</DataListRoot>
```

## Guides

### Semantics

`Root` renders a `dl`. Each `Item` is a `div` holding a `dt` label and a `dd`
value. No interactive role, no keyboard behavior. If you change the elements
with `as` or `asChild`, keep the meaning of `dl`, `dt`, and `dd`.

### Shared defaults

`DataList.PropsProvider` sets reactive default `size`, `orientation`, and
`variant` for the lists inside it. A prop on a root wins. Responsive values
work, such as `orientation={{ base: 'vertical', md: 'horizontal' }}`.

## Props

### Root

| Prop          | Default      | Type                         | Description                         |
| ------------- | ------------ | ---------------------------- | ----------------------------------- |
| `orientation` | `'vertical'` | `'horizontal' \| 'vertical'` | Label above its value or beside it. |
| `size`        | `'md'`       | `'sm' \| 'md' \| 'lg'`       | List size.                          |
| `variant`     | `'subtle'`   | `'subtle' \| 'bold'`         | List style.                         |
| `as`          | `dl`         | Native tag name              | HTML tag to render.                 |
| `asChild`     | —            | Solid render function        | Render your own element.            |
| `unstyled`    | —            | `boolean`                    | Turn off the Lever UI styles.       |

## Customize with CSS

Import `@leverui/components/styles.css` once.

Classes: `.lui-data-list__root`, `.lui-data-list__item`,
`.lui-data-list__itemLabel`, `.lui-data-list__itemValue`.

Root attributes: `data-size`, `data-orientation`, `data-variant`, plus one per
breakpoint you set, such as `data-orientation-md`. Unlayered CSS can target
these and use semantic variables such as `--lui-colors-fg-muted`.

A line between items:

```css
.my-data-list > .lui-data-list__item + .lui-data-list__item {
  border-top: 1px solid var(--lui-colors-border);
}
```

## Explorer

Click a part name to highlight it in the preview.
