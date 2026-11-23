# Bleed

Lets content reach past its container's padding, such as an image that runs to
the edge of a card.

Spacing props take a positive amount.

```tsx
import { Bleed, Box } from '@leverui/components';

export function BleedUsage() {
  return (
    <Box class="bleed-usage-card">
      <Bleed inline="10">
        <Box class="bleed-usage-surface">Bleed</Box>
      </Bleed>
    </Box>
  );
}
```

```css
/* bleed-usage.css */
.bleed-usage-card {
  padding: var(--lui-spacing-10);
  border-width: 1px;
}

.bleed-usage-surface {
  display: grid;
  place-items: center;
  min-height: var(--lui-sizes-20);
  background: var(--lui-colors-bg-emphasized);
}
```

## Props

| Prop          | Type                              | Purpose                                                         |
| ------------- | --------------------------------- | --------------------------------------------------------------- |
| `inline`      | Spacing value or responsive value | Extend past both inline edges, usually left and right.          |
| `block`       | Spacing value or responsive value | Extend past both block edges, usually top and bottom.           |
| `inlineStart` | Spacing value or responsive value | Extend past the inline-start edge. Left in left-to-right.       |
| `inlineEnd`   | Spacing value or responsive value | Extend past the inline-end edge. Right in left-to-right.        |
| `blockStart`  | Spacing value or responsive value | Extend past the block-start edge, usually the top.              |
| `blockEnd`    | Spacing value or responsive value | Extend past the block-end edge, usually the bottom.             |
| `as`          | Native HTML tag                   | HTML tag to render.                                             |
| `asChild`     | Render callback                   | Render your own element with Bleed's props.                     |
| `unstyled`    | Boolean                           | Turn off the default styles. The spacing you set still applies. |

Match the parent's padding to reach its edge. Start and end props follow the
text direction. Style with `.lui-bleed`, or pass `class` and `style`.
