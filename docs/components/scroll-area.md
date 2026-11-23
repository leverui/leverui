# Scroll Area

A scrolling region with scrollbars that match your theme.

```tsx
import { ScrollArea } from '@leverui/components';

export function ScrollAreaUsage() {
  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        <ScrollArea.Content />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
```

The scrollbar sits over the content. Pad `ScrollArea.Content` on the scrollbar
side so the bar never covers text.

## Props

### Root

| Prop       | Default | Type                                                  | Description                                    |
| ---------- | ------- | ----------------------------------------------------- | ---------------------------------------------- |
| `variant`  | `hover` | `'hover' \| 'always'`                                 | When the scrollbar shows.                      |
| `size`     | `md`    | `'xs' \| 'sm' \| 'md' \| 'lg'`                        | Scrollbar thickness and the space around it.   |
| `as`       | `div`   | Native HTML tag                                       | HTML tag to render.                            |
| `asChild`  | —       | Solid render callback                                 | Render your own root element.                  |
| `unstyled` | `false` | Boolean                                               | Turn off the Lever UI styles.                  |
| `ids`      | —       | Partial root, viewport, content, scrollbar, thumb IDs | Ids of the elements the state machine manages. |

No `colorPalette` prop. Set the `--lui-scroll-area-*` variables for colors
and scrollbar thickness. `ScrollArea.PropsProvider` sets the default look for
the scroll areas inside it. Defaults are reactive. A prop on a root wins.

### Viewport

| Prop      | Default | Type                  | Description              |
| --------- | ------- | --------------------- | ------------------------ |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.      |
| `asChild` | —       | Solid render callback | Render your own element. |

For scroll shadows, give `Viewport` a class and style its `data-overflow-y`
state.

### Content

| Prop      | Default | Type                  | Description              |
| --------- | ------- | --------------------- | ------------------------ |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.      |
| `asChild` | —       | Solid render callback | Render your own element. |

### Scrollbar

| Prop          | Default    | Type                  | Description                       |
| ------------- | ---------- | --------------------- | --------------------------------- |
| `as`          | `div`      | Native HTML tag       | HTML tag to render.               |
| `asChild`     | —          | Solid render callback | Render your own element.          |
| `orientation` | `vertical` | Scroll orientation    | Direction this scrollbar scrolls. |

`Scrollbar` adds a `Thumb` when it has no children. For overflow in both
directions, render a horizontal scrollbar and a vertical one.

### Thumb

| Prop      | Default | Type                  | Description              |
| --------- | ------- | --------------------- | ------------------------ |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.      |
| `asChild` | —       | Solid render callback | Render your own element. |

Give it a class or set `--lui-scroll-area-thumb-color`.

### Corner

| Prop      | Default | Type                  | Description              |
| --------- | ------- | --------------------- | ------------------------ |
| `as`      | `div`   | Native HTML tag       | HTML tag to render.      |
| `asChild` | —       | Solid render callback | Render your own element. |

Fills the square where the two scrollbars meet.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
