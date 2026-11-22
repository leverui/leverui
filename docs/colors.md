# Colors

Ten palettes, each with 11 shades and a set of named roles. Click a swatch
below to copy its variable.

## Use a color

```css
.promo {
  background: var(--leverui-colors-blue-subtle);
  color: var(--leverui-colors-blue-fg);
}
```

A shade, such as `blue-500`, is the same in light and dark mode. A role, such
as `blue-subtle`, changes with the [color mode](concepts/color-mode.md).

In JavaScript helpers such as [`useChart`](components/use-chart.md), the same
shade is written `blue.500`.

## Color a component

```tsx
<Button colorPalette="blue">Save</Button>
```

`colorPalette` takes any palette name. The full list of variables is in the
[colors reference](theme-variables/colors.md).
