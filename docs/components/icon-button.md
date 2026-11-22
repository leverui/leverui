# Icon Button

A button that shows only an icon, such as a menu or close button. It needs an
accessible label.

```tsx
import { IconButton } from '@leverui/components';
```

```tsx
<IconButton aria-label="Search database">
  <SearchIcon />
</IconButton>
```

## Guides

### Accessibility

Name the button with `aria-label`. Mark the icon `aria-hidden="true"`.

For a standard close button, use [Close Button](close-button.md).

## Props

| Prop               | Default  | Type                                                                  | Description                                      |
| ------------------ | -------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| `spinnerPlacement` | `start`  | `'start' \| 'end'`                                                    | Side the spinner appears on.                     |
| `colorPalette`     | `gray`   | `string`                                                              | Color palette, built-in or your own.             |
| `size`             | `md`     | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`              | Button size.                                     |
| `variant`          | `solid`  | `'solid' \| 'subtle' \| 'surface' \| 'outline' \| 'ghost' \| 'plain'` | Button style.                                    |
| `spinner`          | —        | `JSX.Element`                                                         | Spinner shown while loading.                     |
| `as`               | `button` | Native HTML tag                                                       | HTML tag to render.                              |
| `asChild`          | —        | Solid render function                                                 | Render your own element with the button's props. |

Also takes native button attributes, including `class` and `style`.
