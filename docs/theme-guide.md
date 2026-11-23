# Customize Lever UI with CSS

Themes are plain CSS, so there are no types to generate. Import the default
styles before your own stylesheet.

```tsx
import '@leverui/components/styles.css';
import './theme.css';
```

Set `--lui-*` variables on `:root` in `theme.css` to change the whole app.

```css
:root {
  --lui-colors-blue-500: #6254c7;
  --lui-fonts-body: 'Inter', sans-serif;
  --lui-radii-md: 0.75rem;
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
  --lui-colors-bg: #f5f0ff;
  --lui-colors-fg: #281c42;
  --lui-colors-blue-solid: #6254c7;
  --lui-colors-blue-contrast: #fff;
  --lui-colors-blue-subtle: #e9e1ff;
  --lui-colors-blue-fg: #43328c;
  --lui-radii-l2: 12px;
}
```

- `appearance="light"` keeps the section light when the app goes dark. A
  `Theme` without `appearance` inherits the surrounding mode.
- The overrides are fixed colors. They do not adapt to the mode.
- To change a section's background, set a semantic variable such as
  `--lui-colors-bg`. Changing a scale color does not replace it.
- `blue-solid` and `blue-subtle` restyle the Button variants.

## Component CSS hooks

```tsx
import { Box } from '@leverui/components';

<Box class="outlined-panel">Content</Box>;
```

```css
.outlined-panel {
  box-shadow: 0 0 0 1px var(--lui-colors-red-500);
}
```

Set `--lui-tabs-indicator-bg`, `--lui-tabs-indicator-shadow`, and
`--lui-tabs-trigger-radius` on the Tabs root to restyle its indicator.
`--lui-private-*` variables are not public.

Check root and nested overrides in light and dark modes. For a new variant,
add your own class with CSS for its states and breakpoints.

### Part classes and attributes

Every part has a class named after its component and part, such as
`.lui-popover__trigger`. Style parts with these classes.

Every part also has a `data-` attribute with the same name, such as
`data-popover-trigger`. Its value is an id that ties the part to its component.
Only parts that another part points to, such as a trigger and its content, get
an `id`. Pass `id` to a part when you need one.

```css
.lui-popover__trigger[data-state='open'] {
  background: var(--lui-colors-bg-muted);
}
```

## Put a popup above other content

A popup's `z-index` goes on the element that positions it, not on its content.
For Popover, Menu, Select, Combobox, HoverCard, Tooltip, DatePicker, and
ColorPicker, set it on `.lui-<component>__positioner`. For toasts, set it
on `.lui-toast__toaster`.

```css
.lui-menu__positioner {
  z-index: 50;
}
```

Positioners, and the dialog and drawer backdrops, stack at
`calc(<layer z-index> + var(--layer-index))`, so a popup opened from another
popup lands above it.
