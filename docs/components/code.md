# Code

Marks a short piece of code inside a sentence, such as a function name.

```tsx
import { Code } from '@leverui/components';
```

```tsx
<Code>Hello world</Code>
```

## Props

| Prop           | Default  | Type                                                       | Description                                  |
| -------------- | -------- | ---------------------------------------------------------- | -------------------------------------------- |
| `colorPalette` | `gray`   | `string`                                                   | Built-in or custom color palette.            |
| `variant`      | `subtle` | `'solid' \| 'subtle' \| 'outline' \| 'surface' \| 'plain'` | Code style. Responsive.                      |
| `size`         | `sm`     | `'xs' \| 'sm' \| 'md' \| 'lg'`                             | Code size. Responsive.                       |
| `as`           | `code`   | Native HTML tag                                            | HTML tag to render.                          |
| `asChild`      | —        | Solid render function                                      | Render your own element with `Code`'s props. |

`Code` is inline. For a copyable block of several lines, use
[Code Block](code-block.md). Style one `Code` with `class` or `style`.
