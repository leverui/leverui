# Center

Centers its children horizontally and vertically.

```tsx
import { Center } from '@leverui/components';

export function CenterUsage() {
  return <Center class="center-usage">This is the Center</Center>;
}
```

```css
/* center-usage.css */
.center-usage {
  height: 100px;
  background: tomato;
  color: #111827;
}
```

## Props

### Center

| Prop       | Default | Type                  | Description                                        |
| ---------- | ------- | --------------------- | -------------------------------------------------- |
| `inline`   | `false` | Responsive boolean    | Use `inline-flex`, not `flex`. As wide as content. |
| `as`       | `div`   | Native HTML tag       | HTML tag to render.                                |
| `asChild`  | —       | Solid render callback | Render your own element instead.                   |
| `unstyled` | `false` | Boolean               | Turn off the flex layout styles.                   |

### Square

| Prop       | Default | Type                                        | Description                       |
| ---------- | ------- | ------------------------------------------- | --------------------------------- |
| `size`     | —       | Size token, CSS length, or responsive value | Width and height, same value.     |
| `as`       | `div`   | Native HTML tag                             | HTML tag to render.               |
| `asChild`  | —       | Solid render callback                       | Render your own element instead.  |
| `unstyled` | `false` | Boolean                                     | Turn off the shape layout styles. |

### Circle

Same props as `Square`. Adds `border-radius: 9999px`.

All three accept `class` and `style`. Set sizes, spacing, and colors in your
own CSS or with `--lui-*` variables.
