# Segmented Control

A row of buttons for picking one option, with the choice shown as a sliding
highlight.

```tsx
import { SegmentGroup } from '@leverui/components';
```

```tsx
<SegmentGroup.Root>
  <SegmentGroup.Indicator />
  <SegmentGroup.Item>
    <SegmentGroup.ItemText />
    <SegmentGroup.ItemHiddenInput />
  </SegmentGroup.Item>
</SegmentGroup.Root>
```

## Shortcuts

### SegmentGroupItems

`SegmentGroupItems` renders one item for each entry in `items`. Same output as
the loop, when you do not need to customize the items.

```tsx
<For each={items}>
  {(item) => (
    <SegmentGroup.Item value={item.value}>
      <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
      <SegmentGroup.ItemHiddenInput />
    </SegmentGroup.Item>
  )}
</For>
```

```tsx
<SegmentGroup.Items items={items} />
```

## Guides

Built on standard radio inputs, so keyboard and form submission work as they
do for radio buttons. Name every group with `aria-label` or `aria-labelledby`.

`Items` takes strings, or objects with a `value`, a `label`, and an optional
`disabled` flag. `label` can be JSX. Each option renders an `Item`, an
`ItemText`, and an `ItemHiddenInput`. Put those parts together yourself when an
option needs more content. `Indicator` draws the background that slides to the
selected option. Place it inside `Root`.

When `items` changes, the group keeps its selection if that value is still in
the list. An item with the same `value` keeps its radio element, so the
indicator stays lined up.

Use `as="div"` on `Items` or `Item` when the container should not be a `label`.
With `asChild`, the container `Item` renders must not be interactive and must
not be another `label`. A `div` is fine.

`RootProvider` takes a state machine from `useSegmentGroup`. `PropsProvider`
gives `Root` reactive default props without replacing the group. A responsive
value, such as `size={{ base: 'xs', md: 'lg' }}`, switches at the 768px
breakpoint through CSS media queries. For right-to-left layouts, wrap the group
in `LocaleProvider`. The arrow keys follow its direction.

`required` on `Root` uses the browser's radio group validation: the form is
invalid until someone picks an option. `invalid` marks the group and its radio
inputs as invalid. A disabled group is left out of the form data. A read-only
group shows its value, but its inputs are disabled, so it is not submitted.

## Props

### Root

| Prop            | Default      | Type                                             | Description                                                    |
| --------------- | ------------ | ------------------------------------------------ | -------------------------------------------------------------- |
| `orientation`   | `horizontal` | `'horizontal' \| 'vertical'`                     | Lay the options out in a row or a column.                      |
| `size`          | `md`         | `'xs' \| 'sm' \| 'md' \| 'lg'` or responsive map | Control size.                                                  |
| `as`            | `div`        | Native HTML tag                                  | HTML tag to render.                                            |
| `asChild`       | —            | Solid render function                            | Render your own element with the root's props.                 |
| `unstyled`      | `false`      | `boolean`                                        | Turn off the Lever UI styles.                                  |
| `defaultValue`  | —            | `string`                                         | Option selected at first. Uncontrolled.                        |
| `disabled`      | —            | `boolean`                                        | Disable the whole group.                                       |
| `form`          | —            | `string`                                         | Form the underlying inputs belong to.                          |
| `id`            | —            | `string`                                         | Unique id of the group's state machine.                        |
| `ids`           | —            | `Partial<ElementIds>`                            | Ids of the group's elements. For composing the parts yourself. |
| `invalid`       | —            | `boolean`                                        | Mark the group as invalid.                                     |
| `name`          | —            | `string`                                         | Name of the inputs. Used on form submit.                       |
| `onValueChange` | —            | `(details: ValueChangeDetails) => void`          | Called when someone selects an option.                         |
| `readOnly`      | —            | `boolean`                                        | Make the group read-only.                                      |
| `required`      | —            | `boolean`                                        | Mark the group as required.                                    |
| `value`         | —            | `string`                                         | Selected option. Controlled.                                   |

## Customize with CSS

Import the library CSS once. Customize with `class` and `style`, the
`.leverui-segment-group__*` part classes, and public variables such as
`--lui-segment-group-background`,
`--lui-segment-group-indicator-background`,
`--lui-segment-group-indicator-shadow`,
`--lui-segment-group-item-height`,
`--lui-segment-group-item-line-height`, and
`--lui-segment-group-radius`. Plain CSS that is not inside a cascade layer
overrides the defaults.
