# Portal

Renders its content at the end of the page, outside its parent, so it can sit
above everything else.

```tsx
import { Portal } from '@leverui/components';
```

```tsx
<Portal>
  <div>Portal content</div>
</Portal>
```

## Examples

### Custom Container

```tsx
import { createSignal } from 'solid-js';
import { Portal } from '@leverui/components';

export function Demo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();

  return (
    <>
      <Portal container={container}>
        <div>Portal content</div>
      </Portal>
      <div ref={setContainer} />
    </>
  );
}
```

### Disabled

```tsx
import { Portal } from '@leverui/components';

export function Demo() {
  return (
    <Portal disabled>
      <div>Will render the content in place</div>
    </Portal>
  );
}
```

## Server Rendering

Content renders in place on the server and moves to its destination after
mount. No client-only wrapper needed.

## Guides

### Default destination

With no `container`, `Portal` renders into the current
[environment's](environment-provider.md) document body or shadow root. Inside a
scoped [Theme](theme.md), you may need a container in that scope so the content
gets the theme's CSS variables.

### Accessibility

`Portal` only decides where content renders. It adds no dialog role, focus
management, or accessible name. For an interactive overlay, use the component
made for that job.

## Props

| Prop        | Default | Type                                                        | Description                                                  |
| ----------- | ------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| `container` | —       | `HTMLElement \| Accessor<HTMLElement \| null \| undefined>` | Element to render into. Pass an accessor when it can change. |
| `disabled`  | —       | `boolean`                                                   | Render the children in place.                                |
| `mount`     | —       | `Node`                                                      | Destination for Solid's portal. Wins over `container`.       |

## Customize with CSS

`Portal` adds no styles. After mount, Solid wraps the children in an element
with `display: contents`, so they follow the layout of their destination.
