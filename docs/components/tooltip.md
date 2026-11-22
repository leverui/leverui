# Tooltip

A short label that appears when the user points at or focuses an element.

## Shortcut and parts

`Tooltip` covers the common case: pass the tip as `content` and wrap the
trigger. For full control, such as a custom layout, compose `Tooltip.Root`,
`Tooltip.Trigger`, `Tooltip.Positioner`, and `Tooltip.Content` yourself.
[With Parts](#example-withparts) builds the same tooltip both ways.

## Usage

```tsx
import { Tooltip } from '@leverui/components';
```

```tsx
<Tooltip content="...">{(getProps) => <button {...getProps()} />}</Tooltip>
```

## Guides

### Trigger

The `Tooltip` shortcut takes its trigger as a Solid render function. Spread
`getProps()` on your element to keep the hover and focus behavior and the
accessible link to the tooltip.

### Accessibility

Give the trigger a clear name of its own. The tooltip only adds to it. Keep
essential instructions visible outside the tooltip. For content with links or
controls people need to use, choose [Popover](popover.md) or
[HoverCard](hover-card.md).

## Props

### Root

| Prop                   | Default | Type                                           | Description                                                                      |
| ---------------------- | ------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `closeDelay`           | `150`   | `number`                                       | Wait before closing, in milliseconds.                                            |
| `closeOnClick`         | `true`  | `boolean`                                      | Close on click.                                                                  |
| `closeOnEscape`        | `true`  | `boolean`                                      | Close on Escape.                                                                 |
| `closeOnPointerDown`   | `true`  | `boolean`                                      | Close on pointer down.                                                           |
| `closeOnScroll`        | `true`  | `boolean`                                      | Close on scroll.                                                                 |
| `lazyMount`            | `true`  | `boolean`                                      | Render the content only once the tooltip first opens.                            |
| `openDelay`            | `400`   | `number`                                       | Wait before opening, in milliseconds.                                            |
| `unmountOnExit`        | `true`  | `boolean`                                      | Remove the content from the DOM on close.                                        |
| `unstyled`             | —       | `boolean`                                      | Turn off the default styles.                                                     |
| `aria-label`           | —       | `string`                                       | Custom label for the tooltip.                                                    |
| `defaultOpen`          | —       | `boolean`                                      | Open at first. Uncontrolled.                                                     |
| `defaultTriggerValue`  | —       | `string`                                       | Trigger value at first. Uncontrolled.                                            |
| `disabled`             | —       | `boolean`                                      | Disable the tooltip.                                                             |
| `id`                   | —       | `string`                                       | Unique id.                                                                       |
| `ids`                  | —       | Element ID map                                 | Ids of the tooltip's elements. For combining with other components.              |
| `immediate`            | —       | `boolean`                                      | Apply a `present` change right away, not on the next frame.                      |
| `interactive`          | `false` | `boolean`                                      | Let the user interact with the content. Stays open while the pointer is over it. |
| `onExitComplete`       | —       | `VoidFunction`                                 | Called when the closing animation ends.                                          |
| `onOpenChange`         | —       | `(details: OpenChangeDetails) => void`         | Called when the tooltip opens or closes.                                         |
| `onTriggerValueChange` | —       | `(details: TriggerValueChangeDetails) => void` | Called when the trigger value changes.                                           |
| `open`                 | —       | `boolean`                                      | Open state. Controlled.                                                          |
| `positioning`          | —       | `PositioningOptions`                           | Placement options for the content.                                               |
| `present`              | —       | `boolean`                                      | Present state. Controlled.                                                       |
| `skipAnimationOnMount` | `false` | `boolean`                                      | Skip the animation on first render.                                              |
| `triggerValue`         | —       | `string`                                       | Trigger value. Controlled.                                                       |

The `Tooltip` shortcut also takes `content`, `contentProps`, `showArrow`,
`portalled`, and `portalRef`.

## Customize with CSS

For one-off changes, set `class` or `style` on a part, or override its public
CSS variables.

```css
.account-tooltip {
  --leverui-tooltip-background: #20304a;
  --leverui-tooltip-foreground: white;
}
```

Add `class="account-tooltip"` to `Tooltip.Content`. The arrow takes its
background from the content. `unstyled` on `Tooltip.Root` or a part turns off
the default styles. Behavior stays the same.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
