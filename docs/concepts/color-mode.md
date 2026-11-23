# Color Mode

Dark mode is one attribute on the `html` element:
`data-lui-color-mode="dark"`. A short script sets it before the page
paints. `createColorMode` reads and changes it from your components.

```tsx
import {
  ColorModeButton,
  ColorModeScript,
  createColorMode,
  createColorModeValue,
  DarkMode,
  getColorModeScript,
  LightMode,
} from '@leverui/components';
```

No provider and no extra library. Without the attribute, the page is light.

## Setup

The script goes in the `head` of the page, before your styles. Lever UI does
not read the system setting on its own. The script does.

### Vite

A client-only Vite app has a static `index.html`, so paste the script. This is
the text `getColorModeScript()` returns.

```html
<!-- index.html -->
<html lang="en" data-lui-color-mode="light">
  <head>
    <script>
      (function () {
        var saved = null;
        try {
          saved = localStorage.getItem('leverui-color-mode');
        } catch (error) {}
        var mode =
          saved === 'light' || saved === 'dark'
            ? saved
            : matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
        var root = document.documentElement;
        root.setAttribute('data-lui-color-mode', mode);
        root.classList.add(mode);
        root.style.colorScheme = mode;
      })();
    </script>
  </head>
</html>
```

### Server rendering

Render `ColorModeScript` in the `head` of your page shell, before
`HydrationScript`. The
[server rendering guide](../server-rendering.md) covers the rest.

```tsx
// src/Document.tsx
import { ColorModeScript } from '@leverui/components';
import { HydrationScript, type JSX } from '@solidjs/web';

/** Render the page around the app. */
export default function Document(props: { children?: JSX.Element }): JSX.Element {
  return (
    <html lang="en" data-lui-color-mode="light">
      <head>
        <meta charset="utf-8" />
        <ColorModeScript />
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
```

### Options

| Prop          | Default  | Type                            | Description                      |
| ------------- | -------- | ------------------------------- | -------------------------------- |
| `defaultMode` | `system` | `'light' \| 'dark' \| 'system'` | Mode used when nothing is saved. |
| `nonce`       | —        | `string`                        | Nonce for your security policy.  |

`getColorModeScript({ defaultMode })` returns the same script as text.

### What the script does

1. Reads the choice saved in `localStorage` under `leverui-color-mode`.
2. With no saved choice, uses `defaultMode`. `system` follows the device.
3. Sets `data-lui-color-mode` on `html`, adds a `light` or `dark` class, and
   sets `color-scheme` so native controls match.

It runs before the first paint, so there is no flash of the wrong colors. A
saved value is used only if it is exactly `light` or `dark`. If storage is
blocked, the default still applies.

A strict Content Security Policy blocks inline scripts. Pass `nonce`, or allow
the text from `getColorModeScript()` by hash. The text is the same for the same
options.

## `createColorMode`

Call it in any component.

| Returns           | Type                          | Description                  |
| ----------------- | ----------------------------- | ---------------------------- |
| `colorMode`       | `Accessor<'light' \| 'dark'>` | Current mode: `colorMode()`. |
| `setColorMode`    | `(mode) => void`              | Switch to `light` or `dark`. |
| `toggleColorMode` | `() => void`                  | Switch to the other mode.    |

<!-- example: color-mode/Basic -->

Both functions change the whole page and save the choice. Every component that
calls `createColorMode` updates together.

## `createColorModeValue`

Picks one of two values by mode. `value()` returns the first in light mode and
the second in dark mode.

```ts
const value = createColorModeValue('<light-mode-value>', '<dark-mode-value>');
```

<!-- example: color-mode/Value -->

For colors, prefer CSS. Lever UI's variables, such as `--lui-colors-bg` and
`--lui-colors-fg`, already change with the mode. For your own colors, use a
selector.

```css
.promo {
  border-color: #d4d4d8;
}

[data-lui-color-mode='dark'] .promo {
  border-color: #3f3f46;
}
```
