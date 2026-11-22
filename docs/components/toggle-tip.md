# Toggle Tip

A small tip that opens when the user clicks or taps an info button.

## Shortcut and parts

`ToggleTip`: pass the tip as `content` and wrap the trigger. `InfoTip` adds a
small info button as the trigger.

For full control, use the [Popover](popover.md) parts: `Popover.Root`,
`Popover.Trigger`, `Popover.Positioner`, and `Popover.Content`.
[With Parts](#example-withparts) builds the same tip both ways.

## Usage

```tsx
import { InfoTip, ToggleTip } from '@leverui/components';
```

```tsx
<ToggleTip content="...">{(getProps) => <button {...getProps()} />}</ToggleTip>
```

## Guides

### Trigger

The trigger is a Solid render function. Spread `getProps()` on your element to
keep the open state, keyboard and focus behavior, and the accessible link to
the tip.

Give an icon-only trigger an accessible name that does not change. Use
`contentProps` to give `Popover.Content` its own name or title.

### Portal

Set `portalled={false}` to render the content in place, or pass `portalRef` to
render it inside another element.

## Props

### Root

| Prop                     | Default | Type                                           | Description                                                                                 |
| ------------------------ | ------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `autoFocus`              | `true`  | `boolean`                                      | Focus the first focusable element on open.                                                  |
| `closeOnEscape`          | `true`  | `boolean`                                      | Close on Escape.                                                                            |
| `closeOnInteractOutside` | `true`  | `boolean`                                      | Close on click outside.                                                                     |
| `portalled`              | `true`  | `boolean`                                      | Render the content in a `Portal`. Tab order follows the content.                            |
| `restoreFocus`           | `true`  | `boolean`                                      | Return focus to the previous element on close.                                              |
| `size`                   | `'md'`  | `'xs' \| 'sm' \| 'md' \| 'lg'`                 | Tip size.                                                                                   |
| `unstyled`               | —       | `boolean`                                      | Turn off the default styles.                                                                |
| `defaultOpen`            | —       | `boolean`                                      | Start open, when uncontrolled.                                                              |
| `defaultTriggerValue`    | —       | `string`                                       | Starting trigger value, when uncontrolled.                                                  |
| `finalFocusEl`           | —       | `() => MaybeElement`                           | Returns the element to focus on close.                                                      |
| `id`                     | —       | `string`                                       | Unique id.                                                                                  |
| `ids`                    | —       | Element ID map                                 | Ids of the popover elements.                                                                |
| `immediate`              | —       | `boolean`                                      | Apply `present` changes right away, not on the next frame.                                  |
| `initialFocusEl`         | —       | `() => HTMLElement \| null`                    | Returns the element to focus on open.                                                       |
| `lazyMount`              | `false` | `boolean`                                      | Render the content only once the popover first opens.                                       |
| `modal`                  | `false` | `boolean`                                      | Block interaction and scrolling outside, hide the rest from screen readers, and trap focus. |
| `onEscapeKeyDown`        | —       | `(event: KeyboardEvent) => void`               | Called on Escape.                                                                           |
| `onExitComplete`         | —       | `VoidFunction`                                 | Called when the closing animation ends.                                                     |
| `onFocusOutside`         | —       | `(event: FocusOutsideEvent) => void`           | Called when focus moves outside the popover.                                                |
| `onInteractOutside`      | —       | `(event: InteractOutsideEvent) => void`        | Called on interaction outside the popover.                                                  |
| `onOpenChange`           | —       | `(details: OpenChangeDetails) => void`         | Called when the popover opens or closes.                                                    |
| `onPointerDownOutside`   | —       | `(event: PointerDownOutsideEvent) => void`     | Called on pointer down outside the popover.                                                 |
| `onRequestDismiss`       | —       | `(event: LayerDismissEvent) => void`           | Called when this layer closes because a parent layer closed.                                |
| `onTriggerValueChange`   | —       | `(details: TriggerValueChangeDetails) => void` | Called when the trigger value changes.                                                      |
| `open`                   | —       | `boolean`                                      | Open state, when you control it.                                                            |
| `persistentElements`     | —       | `(() => Element \| null)[]`                    | Elements that keep pointer events and do not close the popover.                             |
| `positioning`            | —       | `PositioningOptions`                           | Placement options for the content.                                                          |
| `present`                | —       | `boolean`                                      | Present state, when you control it.                                                         |
| `skipAnimationOnMount`   | `false` | `boolean`                                      | Skip the animation on the first render.                                                     |
| `translations`           | —       | `IntlTranslations`                             | Translated text for assistive technology.                                                   |
| `triggerValue`           | —       | `string`                                       | Trigger value, when you control it.                                                         |
| `unmountOnExit`          | `false` | `boolean`                                      | Remove the content from the DOM on close.                                                   |

`ToggleTip` also takes `content`, `showArrow`, `portalRef`, and `contentProps`.
`InfoTip` adds `buttonProps`, which go to its icon button.
