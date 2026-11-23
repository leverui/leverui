# Color Swatch

Shows a sample of a color.

```tsx
import { ColorSwatch } from '@leverui/components';
```

```tsx
<ColorSwatch />
```

## Props

### ColorSwatch

| Prop       | Default   | Type                                                                            | Description                                      |
| ---------- | --------- | ------------------------------------------------------------------------------- | ------------------------------------------------ |
| `value`    | —         | `string`                                                                        | CSS color to show. Also set as `data-value`.     |
| `size`     | `md`      | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'inherit' \| 'full'` | Swatch size. Responsive.                         |
| `shape`    | `rounded` | `'square' \| 'circle' \| 'rounded'`                                             | Swatch shape. Responsive.                        |
| `as`       | `span`    | Native tag                                                                      | HTML tag to render.                              |
| `asChild`  | —         | Solid render function                                                           | Render your own element with the swatch's props. |
| `unstyled` | —         | `boolean`                                                                       | Turn off the default swatch styles.              |

### ColorSwatchMix

Takes the same `size`, `shape`, `as`, `asChild`, and `unstyled` props, plus
`items`: up to four CSS colors shown in one swatch. More than four throws an
error. With three colors, the last fills both columns of the grid.

Not interactive: no role, no keyboard. For an accessible name, put a text label
next to it, or add `aria-label` when the color carries meaning on its own.

A transparent color shows the checkerboard behind it.

`ColorSwatchPropsProvider` sets default props for the swatches inside it. A
prop on a swatch wins.

## Customize with CSS

Classes: `.lui-color-swatch`, and `.lui-color-swatch__mix-grid` for the
mix grid.

Attributes: `data-size`, `data-shape`, plus the usual attributes for each
breakpoint.

Variables: `--lui-swatch-color`, `--lui-swatch-size`,
`--lui-swatch-radius`. Checkerboard: `--lui-swatch-checker-size`,
`--lui-swatch-checker-bg`, `--lui-swatch-checker-fg`.
