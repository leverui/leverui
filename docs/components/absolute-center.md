# AbsoluteCenter

Centers an element over its parent, on one axis or both, without changing the
parent's layout.

The parent must have `position: relative`.

```tsx
import { AbsoluteCenter, Box } from '@leverui/components';

export function AbsoluteCenterUsage() {
  return (
    <Box class="absolute-center-usage-panel">
      <AbsoluteCenter>Centered Content</AbsoluteCenter>
    </Box>
  );
}
```

```css
/* absolute-center-usage.css */
.absolute-center-usage-panel {
  position: relative;
  height: 100px;
  background: var(--lui-colors-bg-muted);
}
```

## Props

| Prop       | Default  | Type                                   | Description                    |
| ---------- | -------- | -------------------------------------- | ------------------------------ |
| `axis`     | `'both'` | `'horizontal' \| 'vertical' \| 'both'` | Direction to center in.        |
| `as`       | `div`    | Native HTML tag                        | HTML tag to render.            |
| `asChild`  | —        | Render callback                        | Render your own element.       |
| `unstyled` | `false`  | Boolean                                | Turn off the default position. |

Style with `class`, `style`, `.leverui-absolute-center`, or the `data-axis`
attribute. No `css` prop.
