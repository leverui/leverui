# Box

A generic container for building layouts. Use `as` to render it as a different
tag, such as `section` or `nav`.

```tsx
import { Box } from '@leverui/components';
```

```tsx
<Box />
```

## Props

| Prop        | Default | Type                  | Description                                                |
| ----------- | ------- | --------------------- | ---------------------------------------------------------- |
| `as`        | `div`   | HTML tag name         | The tag to render, such as `section` or `nav`.             |
| `asChild`   | —       | Solid render callback | Render your own element in place of the default.           |
| `textStyle` | —       | `string`              | A text style, such as `sm` or `lg`, for everything inside. |

Box also takes any attribute its tag accepts, such as `id`, `class`, or
`onClick`.

Style a Box with a CSS class. It has no props for colors or spacing.
