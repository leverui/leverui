## Hydration Mismatch

The server does not know the visitor's mode, so `createColorMode` reports
`light` until the page is running in the browser.

Colors are never wrong, because they come from CSS and the script. Only content
you pick by mode, such as a label that says "Dark", can show its light version
for a moment. Wrap that content in `ClientOnly` and show a placeholder until
the browser takes over.

Do not read `localStorage` or the document while rendering.

<!-- example: color-mode/ValueFallback -->

## ColorModeButton

A ready-made toggle: a sun in light mode, a moon in dark mode. Shows a skeleton
until the browser takes over. Takes `IconButton` props such as `size` and
`variant`. `ColorModeIcon` is the icon on its own.

<!-- example: color-mode/IconButton -->

## Forced Color Mode

`LightMode` and `DarkMode` keep everything inside them in one mode, whatever
the page uses. They wrap [`Theme`](../components/theme.md) and work without the
[Setup](#setup) script.

<!-- example: color-mode/Forced -->

## Guides

### Setting Default Color Mode

Set `defaultMode` on `ColorModeScript`, or pass it to `getColorModeScript`. A
saved choice still wins.

**Default to light mode:**

```tsx
<ColorModeScript defaultMode="light" />
```

**Default to dark mode:**

```tsx
<ColorModeScript defaultMode="dark" />
```

**Respect system preference (default):**

```tsx
<ColorModeScript defaultMode="system" />
```

```ts
getColorModeScript({ defaultMode: 'dark' });
```

With a pasted script, paste the text that call returns.

### Disabling System Preference

Set `defaultMode` to `light` or `dark`. The device setting is then never read.
Once a choice is saved, later changes to the device setting have no effect
either.

### Using Custom Storage Key

Not supported. The mode is always saved in `localStorage` under
`leverui-color-mode`, exported as `colorModeStorageKey`. A different key needs
your own script and your own controls.

```ts
import { colorModeStorageKey } from '@leverui/components';
```

### Forcing a Specific Page to Light/Dark Mode

Wrap the page in `Theme`. Dialogs, menus, and other overlays render at the end
of the document, outside that wrapper, so they follow the page's mode. Mount
them inside the `Theme`, or give them the same theme values.

```tsx
import { Theme } from '@leverui/components';
import type { JSX, ParentProps } from 'solid-js';

/** Keep a route in dark mode regardless of the visitor's choice. */
export function ForcedDarkPage(props: ParentProps): JSX.Element {
  return <Theme appearance="dark">{props.children}</Theme>;
}
```

## FAQ

### Do I need a theme library?

No. `ColorModeScript` is all you need. Any other tool also works if it sets
`data-lui-color-mode` on the `html` element before the page paints.
