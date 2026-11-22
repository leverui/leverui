# Spinner

A spinning circle that shows something is loading.

```tsx
import { Spinner } from '@leverui/components';
```

```tsx
<Spinner />
```

## Guides

Import `@leverui/components/styles.css` once in your app.

`size` is responsive. `colorPalette` sets the
`--leverui-colors-color-palette-*` variables on the spinner, for use in a class
or in `style`. Change the color and speed in your own class. Set
`--leverui-spinner-track-color` for the track.

```css
.loading-indicator {
  color: var(--leverui-colors-blue-500);
  --leverui-spinner-track-color: transparent;
  animation-duration: 800ms;
}
```

Customize with `class` and `style`. No CSS objects, general style props, or
custom recipes.

`Spinner` does not add a status role or an accessible name. Standing alone,
give it `role="status"` and a short label. Next to text that already says
something is loading, hide it from assistive technology.

## Props

### Root

| Prop           | Default | Type                                                                  | Description                                       |
| -------------- | ------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| `size`         | `md`    | `'inherit' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` or responsive map | Spinner size.                                     |
| `colorPalette` | —       | `string`                                                              | Color palette, passed as CSS variables.           |
| `as`           | `span`  | Native HTML tag or `svg`                                              | HTML tag to render.                               |
| `asChild`      | —       | Solid render function                                                 | Render your own element with the spinner's props. |
| `unstyled`     | `false` | `boolean`                                                             | Turn off the Lever UI styles.                     |

`SpinnerPropsProvider` sets default props for the spinners inside it. A prop on
a spinner wins. The values are reactive.
