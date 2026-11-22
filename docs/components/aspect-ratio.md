# Aspect Ratio

Keeps its content at a fixed width-to-height ratio, such as 16 / 9 for a video.

```tsx
import { AspectRatio } from '@leverui/components';

export function AspectRatioUsage() {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe title="Product tour" src="/embeds/product-tour.html" allowfullscreen />
    </AspectRatio>
  );
}
```

## Guide

### Aspect Ratio Token

CSS variables for common ratios: `square`, `landscape`, `portrait`, `wide`,
`ultrawide`, and `golden`. Use them with `aspect-ratio` in your own CSS. The
`ratio` prop takes numbers, not these variables.

```css
.square-preview {
  aspect-ratio: var(--leverui-aspect-ratios-square);
}
```

## Props

| Prop       | Default | Type                                                  | Description                                                   |
| ---------- | ------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| `ratio`    | `4 / 3` | Positive number or responsive object/array of numbers | Width divided by height.                                      |
| `as`       | `div`   | Native HTML tag                                       | HTML tag to render.                                           |
| `asChild`  | —       | Render callback                                       | Render your own element as the frame. Keeps the layout props. |
| `unstyled` | `false` | Boolean                                               | Turn off the ratio layout styles.                             |

Needs one child element, stretched to fill the frame. Images and videos are
cropped to fit. Give each image alt text and each iframe a title.

Restyle with `class`, `style`, and the public CSS variables. No `css` prop.
