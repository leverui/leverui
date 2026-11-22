# Container

A width limit for page content. The container sits in the middle of the page,
with padding at the sides, and its content keeps its normal alignment.

Default max width: `8xl`, which is `90rem` (1440px).

```tsx
import { Container } from '@leverui/components';

export function ContainerUsage() {
  return (
    <Container>
      <div />
    </Container>
  );
}
```

## Props

| Prop            | Default | Type                  | Description                               |
| --------------- | ------- | --------------------- | ----------------------------------------- |
| `as`            | `div`   | Native HTML tag       | HTML tag to render.                       |
| `asChild`       | —       | Solid render callback | Render your own element as the container. |
| `centerContent` | `false` | Responsive boolean    | Stack the children and center them.       |
| `fluid`         | `false` | Responsive boolean    | Fill the width of the parent.             |
| `unstyled`      | `false` | Boolean               | Turn off the default layout styles.       |

Change the width or side padding with `class` or `style`. Variables include
`--leverui-container-max-width`, `--leverui-container-fluid-max-width`, and
`--leverui-container-padding`.

`ContainerPropsProvider` sets default props for the containers inside it. A
prop on a `Container` wins.
