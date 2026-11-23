# Splitter

Splits an area into panels that the user can resize by dragging the divider
between them.

```tsx
import { Splitter } from '@leverui/components';
```

```tsx
<Splitter.Root>
  <Splitter.Panel />
  <Splitter.ResizeTrigger>
    <Splitter.ResizeTriggerSeparator />
    <Splitter.ResizeTriggerIndicator />
  </Splitter.ResizeTrigger>
  <Splitter.Panel />
</Splitter.Root>
```

## Shortcuts

### SplitterResizeTrigger

```tsx
<Splitter.ResizeTrigger id="a:b" />
```

Same as:

```tsx
<Splitter.ResizeTrigger id="a:b">
  <Splitter.ResizeTriggerSeparator />
  <Splitter.ResizeTriggerIndicator />
</Splitter.ResizeTrigger>
```

## Guides

### Splitter Context

Read the context to control the splitter from code. `Splitter.Context` and
`useSplitterContext` both give a Solid accessor. Call it to read the context.

#### Splitter.Context Render Prop

```tsx
<Splitter.Root defaultSize={[50, 50]} panels={[{ id: 'a' }, { id: 'b' }]}>
  <Splitter.Panel id="a">Panel A</Splitter.Panel>

  <Splitter.Context>
    {(context) => <Splitter.ResizeTrigger id="a:b" onDblClick={() => context().resetSizes()} />}
  </Splitter.Context>

  <Splitter.Panel id="b">Panel B</Splitter.Panel>
</Splitter.Root>
```

#### useSplitterContext Hook

```tsx
import { Splitter, useSplitterContext } from '@leverui/components';

function ResetButton() {
  const splitter = useSplitterContext();
  return <button onClick={() => splitter().resetSizes()}>Reset Sizes</button>;
}

export function Demo() {
  return (
    <Splitter.Root defaultSize={[50, 50]} panels={[{ id: 'a' }, { id: 'b' }]}>
      <Splitter.Panel id="a">Panel A</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">
        <ResetButton />
      </Splitter.Panel>
    </Splitter.Root>
  );
}
```

Context methods:

- **`resetSizes()`**: Put every panel back to its default size.
- **`setSizes(sizes)`**: Set the panel sizes.
- **`collapsePanel(id)`**: Collapse the panel with that id.
- **`expandPanel(id)`**: Expand a collapsed panel.
- **`isPanelCollapsed(id)`**: Whether a panel is collapsed.
- **`getItems()`**: Current items: the panels and the handles.
- **`getSizes()`**: Current panel sizes, as an array.

### Panels and handles

Each panel `id` must match an entry in `panels`. A resize trigger's `id` is the
ids of the two panels next to it, joined with a colon. A number in
`defaultSize` is a starting size in percent. A CSS length string such as
`"180px"` also works.

To control the sizes, use `size` with `onResize`. Use `onResizeEnd` for work
that runs once a drag or keyboard resize has finished. Give panels a minimum
and a maximum size. Keep the contents of both panels reachable at the smallest
size.

`Splitter.PropsProvider` gives the splitters inside it reactive default props:
splitter options or HTML attributes. `createSplitterRegistry` lets nested
splitters work together.

## Props

### Root

| Prop                | Default      | Type                                                                                                                                       | Description                                                 |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `panels` (required) | —            | `PanelData[]`                                                                                                                              | Panels and their size limits.                               |
| `orientation`       | `horizontal` | `'horizontal' \| 'vertical'`                                                                                                               | Panels side by side (`horizontal`) or stacked (`vertical`). |
| `as`                | `div`        | Native HTML tag                                                                                                                            | HTML tag to render.                                         |
| `asChild`           | —            | Solid render function                                                                                                                      | Render your own element with the root's props.              |
| `unstyled`          | `false`      | `boolean`                                                                                                                                  | Turn off the Lever UI styles.                               |
| `defaultSize`       | —            | `PanelSize[]`                                                                                                                              | Starting panel sizes, when you do not control them.         |
| `id`                | —            | `string`                                                                                                                                   | Unique id for the splitter's state machine.                 |
| `ids`               | —            | `Partial<{ root: string; resizeTrigger: (id: string) => string; label: (id: string) => string; panel: (id: string \| number) => string }>` | Ids for the elements in the splitter.                       |
| `keyboardResizeBy`  | —            | `number`                                                                                                                                   | Pixels a keyboard resize moves a panel.                     |
| `nonce`             | —            | `string`                                                                                                                                   | Nonce for the cursor stylesheet the splitter adds.          |
| `onCollapse`        | —            | `(details: SplitterExpandCollapseDetails) => void`                                                                                         | Called when a panel collapses.                              |
| `onExpand`          | —            | `(details: SplitterExpandCollapseDetails) => void`                                                                                         | Called when a panel expands.                                |
| `onResize`          | —            | `(details: SplitterResizeDetails) => void`                                                                                                 | Called when the splitter is resized.                        |
| `onResizeEnd`       | —            | `(details: SplitterResizeEndDetails) => void`                                                                                              | Called when a resize ends.                                  |
| `onResizeStart`     | —            | `() => void`                                                                                                                               | Called when a resize starts.                                |
| `registry`          | —            | `SplitterRegistryReturn`                                                                                                                   | Shared registry. Lets people drag where splitters cross.    |
| `size`              | —            | `PanelSize[]`                                                                                                                              | Panel sizes, when you control them.                         |

### Panel

| Prop            | Default | Type                  | Description                                     |
| --------------- | ------- | --------------------- | ----------------------------------------------- |
| `id` (required) | —       | `string`              | Panel id. Must match an entry in `panels`.      |
| `as`            | `div`   | Native HTML tag       | HTML tag to render.                             |
| `asChild`       | —       | Solid render function | Render your own element with the panel's props. |

### ResizeTrigger

| Prop            | Default  | Type                  | Description                                                    |
| --------------- | -------- | --------------------- | -------------------------------------------------------------- |
| `id` (required) | —        | `ResizeTriggerId`     | Ids of the two panels next to the handle, joined with a colon. |
| `as`            | `button` | Native HTML tag       | HTML tag to render.                                            |
| `asChild`       | —        | Solid render function | Render your own element with the handle's props.               |
| `disabled`      | —        | `boolean`             | Turn off resizing with this handle.                            |

## Customize with CSS

The root and every public part have a stable `.lui-splitter__*` class. The
resize trigger carries attributes for its orientation and for its focus,
dragging, and disabled states. Use `style` to size one splitter. `unstyled`
turns off the Lever UI look but keeps resizing and the part classes.

```css
.my-splitter {
  --lui-splitter-thumb-size: 12px;
  --lui-splitter-handle-size: 28px;
  --lui-splitter-border-size: 2px;
}

.my-splitter .lui-splitter__resizeTriggerIndicator {
  background: rebeccapurple;
}
```

Variables also include `--lui-splitter-border-color` and
`--lui-splitter-thumb-color`. Your own class on the trigger, the separator,
or the indicator can override its CSS.

## Explorer

Click a part name to highlight it in the preview.
