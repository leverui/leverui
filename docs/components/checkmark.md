# Checkmark

Draws a check mark that shows a checked or indeterminate state. It is display
only.

```tsx
import { Checkmark } from '@leverui/components';
```

```tsx
<Checkmark checked />
```

## Props

| Prop            | Default | Type                                                        | Description                                          |
| --------------- | ------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| `colorPalette`  | `gray`  | `string`                                                    | Color palette. Built-in or your own.                 |
| `size`          | `md`    | `'xs' \| 'sm' \| 'md' \| 'lg'`                              | Checkmark size. Responsive.                          |
| `variant`       | `solid` | `'solid' \| 'outline' \| 'subtle' \| 'plain' \| 'inverted'` | Checkmark style. Responsive.                         |
| `checked`       | —       | `boolean`                                                   | Show the check icon.                                 |
| `indeterminate` | —       | `boolean`                                                   | Show the indeterminate icon. Wins over `checked`.    |
| `disabled`      | —       | `boolean`                                                   | Show the disabled look.                              |
| `as`            | `svg`   | Native SVG tag                                              | SVG tag to render.                                   |
| `asChild`       | —       | Solid render function                                       | Render your own element with the checkmark's props.  |
| `filled`        | —       | `boolean`                                                   | Add a background to the outline variant. Responsive. |

Display only. `Checkmark` holds no state and does not react to clicks, so
connect it to your app's state or to an interactive control.

No role or accessible name by default. Add `aria-hidden="true"` when a control
next to it already gives the state. Add a role and a name when the SVG itself
carries the information.

## Customize with CSS

The SVG has `data-state`, `data-size`, `data-variant`, and `data-filled`. Your
CSS overrides the defaults without `!important`.

```tsx
<Checkmark checked class="order-checkmark" />
```

```css
.order-checkmark {
  border-radius: 50%;
  --lui-colors-color-palette-solid: rebeccapurple;
}
```

`unstyled` turns off the default styles. The icon, the state attributes, and
the SVG element stay.
