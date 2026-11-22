# Separator

A line that divides content, across or down the page.

```tsx
import { Separator } from '@leverui/components';
```

```tsx
<Separator />
```

## Guides

Renders a `<span>` with the `separator` role. The line uses the Lever UI border
color.

When the direction changes at a breakpoint, the border on the old edge stays.
Remove it in your own CSS to show only one line.

Set `orientation` on each vertical `Separator`. The ARIA orientation comes only
from that prop. A provider default changes only how the line looks.

No `label` prop. Put text between two separators in a flex row. Remove one line
to put the label at the start or the end.

## Props

| Prop          | Default      | Type                                                | Description                                         |
| ------------- | ------------ | --------------------------------------------------- | --------------------------------------------------- |
| `variant`     | `solid`      | `'solid' \| 'dashed' \| 'dotted'` or responsive map | Line style.                                         |
| `orientation` | `horizontal` | `'vertical' \| 'horizontal'` or responsive map      | Line direction.                                     |
| `size`        | `sm`         | `'xs' \| 'sm' \| 'md' \| 'lg'` or responsive map    | Line thickness.                                     |
| `as`          | `span`       | Native HTML tag                                     | HTML tag to render.                                 |
| `asChild`     | —            | Solid render function                               | Render your own element with the separator's props. |
| `unstyled`    | `false`      | `boolean`                                           | Turn off the Lever UI styles.                       |

Also accepts normal HTML attributes, `ref`, `class`, and `style`.
`SeparatorPropsProvider` sets the default variant and `unstyled` value for the
separators inside it. Defaults are reactive. A prop on a separator wins.

## Customize with CSS

Import `@leverui/components/styles.css` before your own CSS. Your CSS can then
target `.leverui-separator` without `!important`. Set
`--leverui-separator-color` and `--leverui-separator-thickness` on one
separator or on a theme wrapper.

Attributes: `data-size`, `data-variant`, `data-orientation`, and per-breakpoint
forms such as `data-size-md`.
