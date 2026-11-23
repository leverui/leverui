# Radiomark

Draws the dot of a radio button that shows a selected state. It is display only.

```tsx
import { Radiomark } from '@leverui/components';
```

```tsx
<Radiomark checked />
```

## Props

| Prop           | Default | Type                                             | Description                                          |
| -------------- | ------- | ------------------------------------------------ | ---------------------------------------------------- |
| `colorPalette` | `gray`  | `string`                                         | Color palette, built-in or your own.                 |
| `variant`      | `solid` | `'solid' \| 'subtle' \| 'outline' \| 'inverted'` | Radiomark style. Responsive.                         |
| `size`         | `md`    | `'xs' \| 'sm' \| 'md' \| 'lg'`                   | Radiomark size. Responsive.                          |
| `checked`      | —       | `boolean`                                        | Show the dot that marks the option as selected.      |
| `disabled`     | —       | `boolean`                                        | Make the radiomark look disabled.                    |
| `as`           | `span`  | Native HTML tag                                  | HTML tag to render.                                  |
| `asChild`      | —       | Solid render function                            | Render your own element with the radiomark's props.  |
| `filled`       | —       | `boolean`                                        | Add a background to the outline variant. Responsive. |

Visual only. It has no state, radio input, role, accessible name, or focus.
Put the radio role and the label on the control that owns the mark, and pass
that control's checked and disabled state to the mark. Ignores `children`. With
`data-invalid` or `aria-invalid="true"` and no palette set, it uses the error
palette.

## Customize with CSS

Import `@leverui/components/styles.css` before your own stylesheet. Style
`.lui-radiomark`, or `.lui-radiomark__dot` for the dot. Props show up
as `data-size`, `data-variant`, and `data-filled`. A value for one screen size
adds a suffix, such as `data-size-md`. State shows up as `data-checked` and
`data-disabled`, the palette as `data-lui-color-palette`.

```css
.lui-radiomark[data-checked] {
  outline-offset: 3px;
}
```

`unstyled` turns off the default styles. The classes and attributes stay.
