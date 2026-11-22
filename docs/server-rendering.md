# Server rendering and hydration

Lever UI components render to HTML on the server and hydrate in the browser.
Solid 2's Vite plugin does the wiring. You write the app.

## Setup

Needs Node 22.12 or later and Vite 8 or 9.

### 1. Turn on server rendering

```ts
// vite.config.ts
import solid from '@solidjs/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [solid({ start: { nodeServer: true }, ssr: true })],
});
```

`start` lets the plugin own the entries, so there is no `index.html`, no server
entry, and no client entry to write. `nodeServer` adds a ready-made Node server
to the build.

### 2. Write the app

The plugin renders the default export of `src/App.tsx`.

```tsx
// src/App.tsx
import '@leverui/components/styles.css';
import { Button, Field, Input } from '@leverui/components';
import { createSignal } from 'solid-js';
import type { JSX } from '@solidjs/web';

/** Render the same form on the server and in the browser. */
export default function App(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);

  /** Show the error after a click in the browser. */
  function check(): void {
    setInvalid(true);
  }

  return (
    <>
      <Field.Root invalid={invalid()}>
        <Field.Label>Email</Field.Label>
        <Input type="email" />
        <Field.ErrorText>Enter a valid email address.</Field.ErrorText>
      </Field.Root>
      <Button onClick={check}>Check email</Button>
    </>
  );
}
```

Import your own CSS after the Lever UI stylesheet. See the
[theme guide](theme-guide.md).

### 3. Run it

| Command                    | What it does                                     |
| -------------------------- | ------------------------------------------------ |
| `vite`                     | Dev server with server rendering and hot reload. |
| `vite build`               | Builds `dist/client` and `dist/server`.          |
| `node dist/server/node.js` | Serves the built app. `PORT` defaults to `3000`. |

## Page shell

The plugin wraps the app in a minimal page. To set the title, the language, or
the [color mode](concepts/color-mode.md) script, add `src/Document.tsx`. It
must render the whole page, with `HydrationScript` in the `head`.

```tsx
// src/Document.tsx
import { ColorModeScript } from '@leverui/components';
import { HydrationScript, type JSX } from '@solidjs/web';

/** Render the page around the app. */
export default function Document(props: { children?: JSX.Element }): JSX.Element {
  return (
    <html lang="en" data-leverui-color-mode="light">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My app</title>
        <ColorModeScript />
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
```

The plugin adds the stylesheet and the client script to the `head` for you.

## Other hosts

`dist/server/server.js` works anywhere that speaks the web `Request` and
`Response` types, such as Workers, Deno, and Bun.

```js
import app, { handleRequest } from './dist/server/server.js';

const response = await handleRequest(request);
const sameResponse = await app.fetch(request);
```

Serve `dist/client` as static files. For a static site, call `handleRequest`
once for each page at build time and save the HTML. The
[plugin's documentation](https://github.com/solidjs/solid-vite-plugin#readme)
covers middleware, server functions, and custom entries.

## Streaming

The server streams by default: it sends the page at once and fills in content
behind `Loading` boundaries as it arrives. To send one complete page instead,
set `renderMode`. Clients that do not run JavaScript, such as crawlers, need
the complete page.

```ts
solid({ start: { nodeServer: true, renderMode: 'async' }, ssr: true });
```

Lever UI's own checks render pages with no pending content. If your app
streams content around overlays, test that path yourself.

## Rules for hydration

The browser must build the same tree the server sent.

- Initial props, field IDs, and child order must match the server output.
- Read `window`, `document`, storage, and layout measurements after mount, in
  `onSettled`.
- For content that needs a browser API, pass a render function to
  [`ClientOnly`](components/client-only.md). Its fallback shows on the server
  and until the browser takes over.

```tsx
import { ClientOnly } from '@leverui/components';
import type { JSX } from '@solidjs/web';

/** Show the browser location only after the page has hydrated. */
export function CurrentPath(): JSX.Element {
  /** Read the browser API only once ClientOnly mounts. */
  function renderPath(): JSX.Element {
    return <span>{window.location.pathname}</span>;
  }

  return <ClientOnly fallback={<span>Loading path</span>}>{renderPath}</ClientOnly>;
}
```

Browser-backed hooks such as `useBreakpointValue` return a server-safe value
first, then update after mount. `useBreakpointValue` renders its `fallback`, or
`base`, during server rendering and hydration.

```tsx
import { useBreakpointValue } from '@leverui/components';
import type { JSX } from '@solidjs/web';

/** Read the breakpoint after hydration and keep the first render stable. */
export function Layout(): JSX.Element {
  const label = useBreakpointValue({ base: 'mobile', md: 'desktop' });

  return <div>{label()}</div>;
}
```

Also worth knowing:

- Overlays that start open: use `Portal`, and keep the trigger, title, and
  content in the same component tree.
- `Toaster` renders its labeled live region on the server. The region is empty
  in server output.
- Solid 2 writes an empty attribute as its bare name: `data-disabled`, not
  `data-disabled=""`. Browsers and CSS selectors treat both the same.

## What to verify

- The server response contains your content, already styled.
- The browser console shows no hydration warning or error.
- A click after hydration works, and updates accessible state such as
  `aria-invalid`.
- Each label's `for` points to its input's `id`, and helper or error text is
  part of the input's description.
- Two requests at once do not share state or IDs.

For interaction checks, see [accessibility](accessibility.md).
