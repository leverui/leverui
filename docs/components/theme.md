# Theme

Applies light or dark mode, and a color palette, to the part of the page inside
it.

```tsx
import { Theme } from '@leverui/components';
```

```tsx
<Theme appearance="dark">
  <div />
</Theme>
```

## Page Specific Color Mode

Wrap the whole page in `Theme`.

```tsx
import type { ParentProps } from 'solid-js';
import { Theme } from '@leverui/components';

export function ForcedColorMode(props: ParentProps) {
  return <Theme appearance="dark">{props.children}</Theme>;
}
```

## Guides

### Scoped appearance

Finish the [stylesheet setup](../getting-started.md) first. `Theme` applies
light or dark mode only to the elements inside it. By default it also gives
that section the theme's text and background colors.

Leave out `appearance` to use the surrounding mode. Set `hasBackground={false}`
to leave the background as it is. Also takes native HTML attributes, `class`,
`style`, and a named `colorPalette`.

### Portalled content

Mount portal content inside the `Theme`, or give it the same theme values
where it renders. `Theme` changes colors only, not what its children mean to
browsers and screen readers.

## Customize with CSS

Add a class to set public `--leverui-*` variables for that section only. See
the [CSS theme guide](../theme-guide.md). Changing a palette scale color on the
nested element does not recompute a background color it inherited. Set
`--leverui-colors-bg` directly when you need to.

```tsx
<Theme appearance="dark" class="preview-panel">
  <Text>Dark preview</Text>
</Theme>
```

```css
.preview-panel {
  padding: var(--leverui-spacing-4);
}
```
