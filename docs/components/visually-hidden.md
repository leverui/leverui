# Visually Hidden

Hides content from view but keeps it for screen readers.

```tsx
import { VisuallyHidden } from '@leverui/components';
```

```tsx
<VisuallyHidden>Hidden content</VisuallyHidden>
```

## Guides

### Icon-only controls

Hidden text gives an icon-only button a name for screen readers. Hide the icon
itself from screen readers so the button is not read twice.

```tsx
<button type="button">
  <MenuIcon />
  <VisuallyHidden>Open menu</VisuallyHidden>
</button>
```

### Hiding from everyone

Screen readers still read the content. When nobody should get it, hide it for
real or do not render it.

## Customize with CSS

Renders a `span` by default. The rules that hide it are in the Lever UI
stylesheet. To hide your own elements the same way, give them the
`.leverui-visually-hidden` class. `class` and `style` work.
