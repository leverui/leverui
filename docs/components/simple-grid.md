# SimpleGrid

A grid of equal columns, set by a column count or a minimum width.

```tsx
import { SimpleGrid } from '@leverui/components';
```

```tsx
<SimpleGrid>
  <Box />
  <Box />
</SimpleGrid>
```

## Guides

Equal-width columns, set with `columns` or `minChildWidth`. Takes the same
layout aliases and HTML props as [Grid](grid.md). Import the
[Lever UI stylesheet](../getting-started.md) once.

`columns` is the number of columns. Responsive. `minChildWidth="16rem"` gives
`auto-fit` columns that wrap as space runs out, and overrides `columns`. A
number is read as pixels. A named size token is looked up through the public
CSS variables. To span columns or rows, use `GridItem` from [Grid](grid.md).

No `gap`, `rowGap`, or `columnGap` style props. Set those CSS properties with a
class or the `style` attribute.

Grid placement can change the visual order without changing the HTML order.
Keep the HTML order sensible, because keyboards and screen readers follow it.
