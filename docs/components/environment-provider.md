# Environment Provider

Tells Lever UI which document and window to use, so components work inside an
iframe or a shadow root.

Needed inside an iframe, a Shadow DOM tree, or Electron.

## Usage

```tsx
import { EnvironmentProvider } from '@leverui/components';
```

```tsx
<EnvironmentProvider>{/* Your App */}</EnvironmentProvider>
```

Changes where components mount and where they look for elements. Does not
change the theme or add styles. Accessor and lifecycle: see the
[Accessing Context](#accessing-context).

## Examples

### iframe

For an `iframe` from the same origin.

```tsx
import { EnvironmentProvider } from '@leverui/components';
import { createSignal, Show } from 'solid-js';
import { Portal } from '@solidjs/web';

export function Demo() {
  const [frameDocument, setFrameDocument] = createSignal<Document>();

  function captureDocument(event: Event & { currentTarget: HTMLIFrameElement }) {
    setFrameDocument(event.currentTarget.contentDocument ?? undefined);
  }

  return (
    <>
      <iframe title="App frame" srcdoc="<body></body>" onLoad={captureDocument} />
      <Show when={frameDocument()}>
        {(document) => (
          <Portal mount={document().body}>
            <EnvironmentProvider value={document}>{/* Your App */}</EnvironmentProvider>
          </Portal>
        )}
      </Show>
    </>
  );
}
```

### Shadow DOM

```tsx
import { EnvironmentProvider } from '@leverui/components';
import { createSignal, Show } from 'solid-js';
import { Portal } from '@solidjs/web';

export function Demo() {
  const [shadowRoot, setShadowRoot] = createSignal<ShadowRoot>();

  function attachRoot(host: HTMLDivElement) {
    setShadowRoot(host.attachShadow({ mode: 'open' }));
  }

  return (
    <>
      <div ref={attachRoot} />
      <Show when={shadowRoot()}>
        {(root) => (
          <Portal mount={root()}>
            <EnvironmentProvider value={root}>{/* Your App */}</EnvironmentProvider>
          </Portal>
        )}
      </Show>
    </>
  );
}
```

### Accessing Context

`useEnvironmentContext` returns an accessor for the current `RootNode`,
`Document`, and `Window`. Its methods need a browser, so call them only where a
DOM exists.

```tsx
import { useEnvironmentContext } from '@leverui/components';

export function Demo() {
  const environment = useEnvironmentContext();

  return <pre>{JSON.stringify(environment().getRootNode(), null, 2)}</pre>;
}
```

## Props

| Prop    | Default | Type                           | Description                                                          |
| ------- | ------- | ------------------------------ | -------------------------------------------------------------------- |
| `value` | —       | `RootNode \| (() => RootNode)` | Document or shadow root for DOM queries, or a function returning it. |
