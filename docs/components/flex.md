# Flex

Lays out its children in a row or a column with flexbox.

```tsx
import { Flex } from '@leverui/components';

export function FlexUsage() {
  return (
    <Flex>
      <div />
      <div />
    </Flex>
  );
}
```

## Props

| Prop        | Default | Type                      | Description                                       |
| ----------- | ------- | ------------------------- | ------------------------------------------------- |
| `align`     | —       | Responsive CSS alignment  | Align children on the cross axis.                 |
| `justify`   | —       | Responsive CSS alignment  | Align children on the main axis.                  |
| `wrap`      | —       | Responsive CSS wrap value | Whether children wrap onto a new line.            |
| `direction` | —       | Responsive CSS direction  | Direction the children flow in.                   |
| `basis`     | —       | Responsive CSS size       | Flex basis, the element's starting size.          |
| `grow`      | —       | Responsive number         | How much the element grows into free space.       |
| `shrink`    | —       | Responsive number         | How much the element shrinks when space is tight. |
| `inline`    | `false` | Boolean                   | Use `inline-flex` instead of `flex`.              |
| `as`        | `div`   | Native HTML tag           | HTML tag to render.                               |
| `asChild`   | —       | Solid render callback     | Render your own root element.                     |
| `unstyled`  | `false` | Boolean                   | Turn off the shared presentation styles.          |

`align`, `justify`, `wrap`, and `direction` set the matching CSS flex
properties. For gaps, padding, and other styling, add your own class.

`order` and `direction` can change the order on screen. Keyboard and
screen-reader users follow the HTML order, so make sure it still makes sense.
