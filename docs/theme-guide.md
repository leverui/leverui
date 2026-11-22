# Customize Lever UI with CSS

Themes are plain CSS, so there are no types to generate. Import the default
styles before your own stylesheet.

```tsx
import '@leverui/components/styles.css';
import './theme.css';
```

Set `--leverui-*` variables on `:root` in `theme.css` to change the whole app.

```css
:root {
  --leverui-colors-blue-500: #6254c7;
  --leverui-fonts-body: 'Inter', sans-serif;
  --leverui-radii-md: 0.75rem;
}
```

Give a `Theme` a class to theme one section.

```tsx
import { Button, Theme } from '@leverui/components';

<Theme appearance="light" class="marketing-panel">
  <Button colorPalette="blue">Learn more</Button>
  <Button colorPalette="blue" variant="subtle">
    See details
  </Button>
</Theme>;
```

```css
.marketing-panel {
  --leverui-colors-bg: #f5f0ff;
  --leverui-colors-fg: #281c42;
  --leverui-colors-blue-solid: #6254c7;
  --leverui-colors-blue-contrast: #fff;
  --leverui-colors-blue-subtle: #e9e1ff;
  --leverui-colors-blue-fg: #43328c;
  --leverui-radii-l2: 12px;
}
```

- `appearance="light"` keeps the section light when the app goes dark. A
  `Theme` without `appearance` inherits the surrounding mode.
- The overrides are fixed colors. They do not adapt to the mode.
- To change a section's background, set a semantic variable such as
  `--leverui-colors-bg`. Changing a scale color does not replace it.
- `blue-solid` and `blue-subtle` restyle the Button variants.

## Component CSS hooks

```tsx
import { Box } from '@leverui/components';

<Box class="outlined-panel">Content</Box>;
```

```css
.outlined-panel {
  box-shadow: 0 0 0 1px var(--leverui-colors-red-500);
}
```

Set `--leverui-tabs-indicator-bg`, `--leverui-tabs-indicator-shadow`, and
`--leverui-tabs-trigger-radius` on the Tabs root to restyle its indicator.
`--leverui-private-*` variables are not public.

Check root and nested overrides in light and dark modes. For a new variant,
add your own class with CSS for its states and breakpoints.

### Part classes and attributes

Every part has a class named after its component and part, such as
`.leverui-popover__trigger`. Style parts with these classes.

Every part also has a `data-` attribute with the same name, such as
`data-popover-trigger`. Its value is an id that ties the part to its component.
Only parts that another part points to, such as a trigger and its content, get
an `id`. Pass `id` to a part when you need one.

```css
.leverui-popover__trigger[data-state='open'] {
  background: var(--leverui-colors-bg-muted);
}
```

## Put a popup above other content

A popup's `z-index` goes on the element that positions it, not on its content.
For Popover, Menu, Select, Combobox, HoverCard, Tooltip, DatePicker, and
ColorPicker, set it on `.leverui-<component>__positioner`. For toasts, set it
on `.leverui-toast__toaster`.

```css
.leverui-menu__positioner {
  z-index: 50;
}
```

Positioners, and the dialog and drawer backdrops, stack at
`calc(<layer z-index> + var(--layer-index))`, so a popup opened from another
popup lands above it.
