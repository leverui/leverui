# Badge

A short label that marks an item, such as a status, a count, or a category.

```tsx
import { Badge } from '@leverui/components';
```

```tsx
<Badge>Badge</Badge>
```

## Props

| Prop           | Default  | Type                                                       | Description                                     |
| -------------- | -------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `colorPalette` | `gray`   | `string`                                                   | Color palette, built-in or your own.            |
| `variant`      | `subtle` | `'solid' \| 'subtle' \| 'outline' \| 'surface' \| 'plain'` | Badge style.                                    |
| `size`         | `sm`     | `'xs' \| 'sm' \| 'md' \| 'lg'` or responsive map           | Badge size.                                     |
| `as`           | `span`   | Native HTML tag                                            | HTML tag to render.                             |
| `asChild`      | —        | Solid render function                                      | Render your own element with the badge's props. |
| `unstyled`     | `false`  | `boolean`                                                  | Turn off the Lever UI styles.                   |

Takes native HTML attributes, including `class` and `style`.
`BadgePropsProvider` sets default props and HTML attributes for the badges
inside it. A provider class and a badge class both apply. A prop on a badge
wins.

Do not use color alone to show status. The text must make sense without it.
If screen readers must announce a status change, put the badge in a live
region.

## Customize with CSS

`.leverui-badge` takes its colors from the palette variables. Set them on your
own class to change one badge.

```tsx
<Badge class="status-badge" variant="solid" colorPalette="blue">
  In review
</Badge>
```

```css
.status-badge {
  --leverui-colors-color-palette-solid: #24406d;
  --leverui-colors-color-palette-contrast: white;
}
```

Set the same variables on a parent to change many badges. Each badge has
`data-size` and `data-variant` attributes for CSS selectors. With a responsive
size, it uses `data-size-sm` through `data-size-2xl` at the matching
breakpoints.
