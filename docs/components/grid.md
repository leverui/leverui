# Grid

Lays out its children on a CSS grid of rows and columns.

```tsx
import { Grid, GridItem } from '@leverui/components';

export function GridUsage() {
  return (
    <Grid templateColumns="repeat(2, minmax(0, 1fr))" class="grid-usage">
      <GridItem>First item</GridItem>
      <GridItem>Second item</GridItem>
    </Grid>
  );
}
```

```css
.grid-usage {
  gap: var(--lui-spacing-4);
}
```

## Props

| Prop              | Default | Type                     | Description                                  |
| ----------------- | ------- | ------------------------ | -------------------------------------------- |
| `templateColumns` | —       | CSS grid track list      | Columns of the grid.                         |
| `autoFlow`        | —       | CSS grid auto-flow value | Direction auto-placed items fill the grid.   |
| `autoRows`        | —       | CSS grid track size      | Size of rows the grid adds on its own.       |
| `autoColumns`     | —       | CSS grid track size      | Size of columns the grid adds on its own.    |
| `templateRows`    | —       | CSS grid track list      | Rows of the grid.                            |
| `templateAreas`   | —       | CSS grid area map        | Named areas to place items in.               |
| `column`          | —       | CSS grid-column value    | Columns this grid takes up in a parent grid. |
| `row`             | —       | CSS grid-row value       | Rows this grid takes up in a parent grid.    |
| `inline`          | `false` | Boolean                  | Use `inline-grid` in place of `grid`.        |
| `as`              | `div`   | Native HTML tag          | HTML tag to render.                          |
| `asChild`         | —       | Solid render callback    | Render your own element as the root.         |
| `unstyled`        | `false` | Boolean                  | Turn off the Lever UI styles.                |

`GridItem` accepts `area`, `colSpan`, `rowSpan`, `colStart`, `colEnd`,
`rowStart`, and `rowEnd`. A number for `colSpan` or `rowSpan` becomes a CSS
`span` value. Responsive values work at the standard breakpoints. Set the gap
and other styles in a CSS class.

Placing items can change the visual order. Keep the DOM order logical:
keyboard users and screen readers follow it.
