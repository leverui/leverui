# Floating Panel

A panel that floats over the page, which the user can drag, resize, and
minimize.

```tsx
import { FloatingPanel } from '@leverui/components';
```

```tsx
<FloatingPanel.Root>
  <FloatingPanel.Trigger />
  <FloatingPanel.Positioner>
    <FloatingPanel.Content>
      <FloatingPanel.Header>
        <FloatingPanel.DragTrigger>
          <FloatingPanel.Title />
        </FloatingPanel.DragTrigger>
        <FloatingPanel.Control>
          <FloatingPanel.StageTrigger />
          <FloatingPanel.CloseTrigger />
        </FloatingPanel.Control>
      </FloatingPanel.Header>
      <FloatingPanel.Body />
      <FloatingPanel.ResizeTriggers />
    </FloatingPanel.Content>
  </FloatingPanel.Positioner>
</FloatingPanel.Root>
```

## Shortcuts

### FloatingPanelResizeTriggers

`FloatingPanel.ResizeTriggers` renders one `FloatingPanel.ResizeTrigger` for
each edge and corner.

```tsx
<FloatingPanel.ResizeTriggers />
```

```tsx
<FloatingPanel.ResizeTrigger placement="n" />
<FloatingPanel.ResizeTrigger placement="s" />
<FloatingPanel.ResizeTrigger placement="e" />
<FloatingPanel.ResizeTrigger placement="w" />
<FloatingPanel.ResizeTrigger placement="ne" />
<FloatingPanel.ResizeTrigger placement="nw" />
<FloatingPanel.ResizeTrigger placement="se" />
<FloatingPanel.ResizeTrigger placement="sw" />
```

Pass `axes` to render only some handles.

```tsx
<FloatingPanel.ResizeTriggers axes={['s', 'e', 'se']} />
```

## Guides

The title names the panel. Give every control a clear label. `defaultSize` sets
the starting size and `minSize` the smallest. For a task that must block the
page, use a [Dialog](dialog.md). Render the `Positioner` inside a `Portal`.

Open a panel from code anywhere with [`createOverlay`](overlay-manager.md).

## Props

### Root

| Prop                   | Default   | Type                                        | Description                                          |
| ---------------------- | --------- | ------------------------------------------- | ---------------------------------------------------- |
| `allowOverflow`        | `true`    | `boolean`                                   | Let the panel be dragged past its boundary.          |
| `dir`                  | `'ltr'`   | `'ltr' \| 'rtl'`                            | Text direction.                                      |
| `draggable`            | `true`    | `boolean`                                   | Allow dragging.                                      |
| `gridSize`             | `1`       | `number`                                    | Grid the panel snaps to.                             |
| `lazyMount`            | `true`    | `boolean`                                   | Render on first open.                                |
| `resizable`            | `true`    | `boolean`                                   | Allow resizing.                                      |
| `restoreFocus`         | `true`    | `boolean`                                   | Return focus to the trigger on close.                |
| `strategy`             | `'fixed'` | `'absolute' \| 'fixed'`                     | CSS positioning method.                              |
| `unmountOnExit`        | `true`    | `boolean`                                   | Remove from the page on close.                       |
| `unstyled`             | —         | `boolean`                                   | Turn off the Lever UI styles.                        |
| `closeOnEscape`        | —         | `boolean`                                   | Close on Escape.                                     |
| `defaultOpen`          | `false`   | `boolean`                                   | Open on first render.                                |
| `defaultPosition`      | —         | `Point`                                     | Position on first render.                            |
| `defaultSize`          | —         | `Size`                                      | Starting size.                                       |
| `disabled`             | —         | `boolean`                                   | Disable the panel.                                   |
| `finalFocusEl`         | —         | `() => HTMLElement \| null`                 | Element focused on close. Default: the trigger.      |
| `getAnchorPosition`    | —         | `(details: AnchorPositionDetails) => Point` | Returns where the panel opens.                       |
| `getBoundaryEl`        | —         | `() => HTMLElement \| null`                 | Returns the panel's boundary element.                |
| `id`                   | —         | `string`                                    | Unique ID.                                           |
| `ids`                  | —         | Element ID map                              | Your own IDs for the panel's elements.               |
| `immediate`            | —         | `boolean`                                   | Apply `present` changes now, not next frame.         |
| `initialFocusEl`       | —         | `() => HTMLElement \| null`                 | Element focused on open.                             |
| `lockAspectRatio`      | —         | `boolean`                                   | Keep the aspect ratio while resizing.                |
| `maxSize`              | —         | `Size`                                      | Largest size.                                        |
| `minSize`              | —         | `Size`                                      | Smallest size.                                       |
| `onExitComplete`       | —         | `VoidFunction`                              | Called when the closing animation ends.              |
| `onOpenChange`         | —         | `(details: OpenChangeDetails) => void`      | Called when the panel opens or closes.               |
| `onPositionChange`     | —         | `(details: PositionChangeDetails) => void`  | Called when dragging moves the panel.                |
| `onPositionChangeEnd`  | —         | `(details: PositionChangeDetails) => void`  | Called when dragging stops.                          |
| `onSizeChange`         | —         | `(details: SizeChangeDetails) => void`      | Called when resizing changes the size.               |
| `onSizeChangeEnd`      | —         | `(details: SizeChangeDetails) => void`      | Called when resizing stops.                          |
| `onStageChange`        | —         | `(details: StageChangeDetails) => void`     | Called when the stage changes, such as to minimized. |
| `open`                 | —         | `boolean`                                   | Controlled open state.                               |
| `persistRect`          | —         | `boolean`                                   | Keep size and position after close.                  |
| `position`             | —         | `Point`                                     | Controlled position.                                 |
| `present`              | —         | `boolean`                                   | Controlled rendered state.                           |
| `size`                 | —         | `Size`                                      | Panel size.                                          |
| `skipAnimationOnMount` | `false`   | `boolean`                                   | Skip the opening animation on first mount.           |
| `translations`         | —         | `IntlTranslations`                          | Translated text.                                     |

## Customize with CSS

Load the [package stylesheet](../getting-started.md) first. Each part has a
`lui-floating-panel__<part>` class and a part attribute, such as
`data-floating-panel-content`. A selector that starts from an element around
`Root` does not reach a part in a portal. Use a class on the part for one
panel, a selector for every panel, or `style` for a single value.

```tsx
<FloatingPanel.Content class="notes-panel" style={{ 'max-height': '80vh' }}>
  ...
</FloatingPanel.Content>
```

```css
@layer lui.recipes {
  .notes-panel[data-lui-floating-panel-css] {
    border: 1px solid var(--lui-colors-border);
  }
}
```

`--lui-colors-bg-panel` sets the content's default background. `unstyled`
on a part or on `Root` turns off its Lever UI styles.
