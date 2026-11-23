# Installation

Lever UI works in any Solid 2 app.

## Install the packages

```sh
pnpm add @leverui/components@next solid-js @solidjs/web
pnpm add -D @solidjs/vite-plugin
```

With npm, use `npm install` and `npm install -D` instead. Keep `@next` until
the first stable release.

Using DatePicker or DateInput? Also install `@internationalized/date@3.12.3`.

## Add the Solid plugin to Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';

export default defineConfig({ plugins: [solid()] });
```

## Update TypeScript settings

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@solidjs/web",
    "lib": ["ES2023", "DOM", "DOM.Iterable"]
  }
}
```

The types pass strict checks without `skipLibCheck`.

## Import the stylesheet

Import it once in your app entry, before your own stylesheet.

```tsx
import '@leverui/components/styles.css';
import './theme.css';
```

Override `--lui-*` variables in `theme.css` to change colors, radius, and
more. See [Customize with CSS](theme-guide.md).

Using Tailwind? See [Tailwind CSS](tailwind.md) for the layer order.

## Render a component

```tsx
import { Button } from '@leverui/components';

/** Render an action using the default stylesheet. */
function App() {
  return <Button colorPalette="blue">Continue</Button>;
}
```

## Next steps

- [Components](concepts/overview.md): every component, with examples.
- [Server rendering](server-rendering.md): render pages on the server.
- [Accessibility](accessibility.md): labels, keyboard, and focus.
- New to Solid 2? Read the [Solid docs](https://docs.solidjs.com).
