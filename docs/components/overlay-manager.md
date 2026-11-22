# Overlay Manager

Opens dialogs and drawers from code, such as from an event handler, without
placing them in your markup first.

```tsx
import { Dialog, Portal, createOverlay } from '@leverui/components';
import { omit } from 'solid-js';
import type { JSX } from '@solidjs/web';

interface DialogProps {
  title: string;
  description?: string;
  content?: JSX.Element;
}

const dialog = createOverlay<DialogProps>((props) => {
  const rest = omit(props, 'title', 'description', 'content');
  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {props.title && (
              <Dialog.Header>
                <Dialog.Title>{props.title}</Dialog.Title>
              </Dialog.Header>
            )}
            <Dialog.Body>
              {props.description && <Dialog.Description>{props.description}</Dialog.Description>}
              {props.content}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
```

Render the `Viewport`. The overlay shows up inside it.

```tsx
<dialog.Viewport />
```

## API

### Props

`createOverlay` passes these props to your overlay component:

- `open`: Open state.
- `onOpenChange`: Called when the overlay opens or closes.
- `onExitComplete`: Called when the closing animation ends.

Pass all three on to the Dialog or Drawer you render. The manager needs them
to know when the closing animation is done.

### Methods

### `Viewport`

Renders every active overlay. Render it once, near the top of your app.

### `open(id, props)`

Opens a new overlay with that id and props. Returns a promise that resolves
with a value of any type.

JSX that needs the overlay's context must be created inside the overlay
component. From an event handler, pass a function that creates it, such as
`content: () => <NestedMenu />`, and call it while the overlay renders.

### `close(id, value)`

Closes the overlay with that id. Returns a promise that resolves when it has
closed.

### `update(id, props)`

Changes the props of the overlay with that id. A mounted overlay keeps its
`onOpenChange` and `onExitComplete` callbacks.

### `remove(id)`

Removes the overlay with that id right away, with no animation. Resolves any
pending promises.

### `removeAll()`

Removes every overlay right away. Resolves any pending promises.

### `get(id)`

Returns the props of the overlay with that id. Call `has(id)` first to check
that it exists.

### `getSnapshot()`

Returns the current props of every overlay.

### `waitForExit(id)`

Returns a promise that resolves when the overlay's closing animation ends.
