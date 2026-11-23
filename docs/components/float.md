# Float

Pins an element to an edge or corner of its parent, such as a count on an
avatar.

The parent must have `position: relative`.

```tsx
import { Box, Float } from '@leverui/components';

export function FloatUsage() {
  return (
    <Box class="float-usage-host">
      <Float>
        <div />
      </Float>
    </Box>
  );
}
```

```css
.float-usage-host {
  position: relative;
  width: 80px;
  height: 80px;
}
```

## Props

| Prop        | Default   | Type                       | Description                          |
| ----------- | --------- | -------------------------- | ------------------------------------ |
| `placement` | `top-end` | Responsive placement value | Edge or midpoint the marker sits on. |
| `offsetX`   | —         | Responsive CSS size        | Move the marker left or right.       |
| `offsetY`   | —         | Responsive CSS size        | Move the marker up or down.          |
| `offset`    | `0`       | Responsive CSS size        | Move the marker on both axes.        |
| `as`        | `div`     | Native HTML tag            | HTML tag to render.                  |
| `asChild`   | —         | Solid render callback      | Render your own element as the root. |
| `unstyled`  | `false`   | Boolean                    | Turn off the Lever UI styles.        |

`placement` joins `top`, `middle`, or `bottom` with `start`, `center`, or `end`,
as in `top-end`. `start` and `end` swap sides in right-to-left text.

Override the offsets with `--lui-float-offset-x` and
`--lui-float-offset-y` in your own class.

If a floating badge conveys a state, give that state a text label for screen
readers, and hide repeated visual text from them.
