# Wrap

Places its children in a row that wraps onto new lines when there is no more
room.

```tsx
import { Wrap, WrapItem } from '@leverui/components';
```

```tsx
<Wrap>
  <div />
  <div />
</Wrap>
```

## Guides

### Layout props

`justify`, `align`, and `direction` set the flex properties with the same
names. `gap`, `rowGap`, and `columnGap` set spacing. Values can be responsive.
`WrapItem` is a flex child that sits at the start of its line. Use it when each
item needs its own wrapper. To align one item differently, give it a class or a
`style`.

### Accessibility

Items move rows as the width changes. Keep the HTML order logical: keyboards
and screen readers follow it. `Wrap` does not mark its items as a list, so use
a native list element when they are one.

## Customize with CSS

Defaults: `display: flex`, `flex-wrap: wrap`, `gap: 8px`. Override `Wrap` or
`WrapItem` with your own classes. `unstyled` keeps the element and turns off its
default styles. To change the defaults in one place, set `--leverui-wrap-gap` on
a `Wrap` that has no `gap` prop, or `--leverui-wrap-item-align` on a `WrapItem`.
