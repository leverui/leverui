# Dialog

A window on top of the page that asks the user to read or do something before
going back.

```tsx
import { Dialog, Portal } from '@leverui/components';
```

```tsx
<Dialog.Root>
  <Dialog.Trigger />
  <Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.CloseTrigger />
        <Dialog.Header>
          <Dialog.Title />
        </Dialog.Header>
        <Dialog.Body />
        <Dialog.Footer />
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog.Root>
```

## Guides

### Accessibility and focus

Screen readers use the title as the dialog's name and the description as its
explanation. Focus moves in on open and returns on close. Put the content in a
`Portal` so a parent cannot clip it. Theme variables on only part of the page?
See [portal and theme scoping](portal.md).

### Action triggers

`Dialog.ActionTrigger` is a button that does something, then closes the dialog.
No default styles. Style it with `class`, `style`, or
`.leverui-dialog__actionTrigger`.

### Shared defaults

`Dialog.PropsProvider` sets default style and mount props for the dialogs
inside it. A prop on a dialog wins. `size` can be responsive.

## Props

### Root

| Prop                     | Default     | Type                                                                                              | Description                                                           |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `closeOnEscape`          | `true`      | `boolean`                                                                                         | Close on Escape.                                                      |
| `closeOnInteractOutside` | `true`      | `boolean`                                                                                         | Close on a click outside.                                             |
| `lazyMount`              | `true`      | `boolean`                                                                                         | Wait for the first open to render content.                            |
| `modal`                  | `true`      | `boolean`                                                                                         | Block clicks and taps outside; hide content below.                    |
| `preventScroll`          | `true`      | `boolean`                                                                                         | Stop the page behind from scrolling while open.                       |
| `role`                   | `'dialog'`  | `'dialog' \| 'alertdialog'`                                                                       | ARIA role.                                                            |
| `trapFocus`              | `true`      | `boolean`                                                                                         | Keep keyboard focus inside while open.                                |
| `unmountOnExit`          | `true`      | `boolean`                                                                                         | Remove content from the page on close.                                |
| `placement`              | `'top'`     | `'center' \| 'top' \| 'bottom'`                                                                   | Position on the screen.                                               |
| `scrollBehavior`         | `'outside'` | `'inside' \| 'outside'`                                                                           | Scroll long content inside the dialog, or the whole dialog.           |
| `size`                   | `'md'`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'cover' \| 'full'`                                       | Dialog size.                                                          |
| `motionPreset`           | `'scale'`   | `'scale' \| 'slide-in-bottom' \| 'slide-in-top' \| 'slide-in-left' \| 'slide-in-right' \| 'none'` | Open and close animation.                                             |
| `unstyled`               | —           | `boolean`                                                                                         | Turn off the Lever UI styles.                                         |
| `aria-label`             | —           | `string`                                                                                          | Screen reader label. Use when there is no title.                      |
| `defaultOpen`            | `false`     | `boolean`                                                                                         | Open on first render.                                                 |
| `defaultTriggerValue`    | —           | `string`                                                                                          | Active trigger value on first render.                                 |
| `finalFocusEl`           | —           | `() => MaybeElement`                                                                              | Element focused on close.                                             |
| `id`                     | —           | `string`                                                                                          | Unique id.                                                            |
| `ids`                    | —           | Element ID map                                                                                    | Your own ids for the dialog's elements.                               |
| `initialFocusEl`         | —           | `() => MaybeElement`                                                                              | Element focused on open.                                              |
| `onEscapeKeyDown`        | —           | `(event: KeyboardEvent) => void`                                                                  | Called when Escape is pressed.                                        |
| `onExitComplete`         | —           | `VoidFunction`                                                                                    | Called when the closing animation ends.                               |
| `onFocusOutside`         | —           | `(event: FocusOutsideEvent) => void`                                                              | Called when focus moves outside.                                      |
| `onInteractOutside`      | —           | `(event: InteractOutsideEvent) => void`                                                           | Called on an interaction outside.                                     |
| `onOpenChange`           | —           | `(details: OpenChangeDetails) => void`                                                            | Called when the dialog opens or closes.                               |
| `onPointerDownOutside`   | —           | `(event: PointerDownOutsideEvent) => void`                                                        | Called on pointer down outside.                                       |
| `onRequestDismiss`       | —           | `(event: LayerDismissEvent) => void`                                                              | Called when closed because a parent layer closed.                     |
| `onTriggerValueChange`   | —           | `(details: TriggerValueChangeDetails) => void`                                                    | Called when the active trigger changes.                               |
| `open`                   | —           | `boolean`                                                                                         | Open state, when you control it.                                      |
| `persistentElements`     | —           | `(() => Element \| null)[]`                                                                       | Getters for outside elements that stay clickable and do not close it. |
| `restoreFocus`           | —           | `boolean`                                                                                         | Return focus to the element that had it before.                       |
| `skipAnimationOnMount`   | `false`     | `boolean`                                                                                         | Skip the opening animation when starting open.                        |
| `triggerValue`           | —           | `string`                                                                                          | Active trigger value, when you control it.                            |

### Trigger

| Prop      | Default  | Type                  | Description                                       |
| --------- | -------- | --------------------- | ------------------------------------------------- |
| `as`      | `button` | Native tag name       | HTML tag to render.                               |
| `asChild` | —        | Solid render function | Render your own element with the trigger's props. |
| `value`   | —        | `string`              | Value that identifies this trigger.               |

## Customize with CSS

Load the [package stylesheet](../getting-started.md) first, then your CSS. Each
part has a stable class, such as `.leverui-dialog__content` or
`.leverui-dialog__header`, and takes `class` and `style`. `unstyled` turns off
the default styles and keeps the part classes.

```tsx
<Dialog.Content class="profile-dialog">...</Dialog.Content>
```

```css
.profile-dialog {
  --lui-colors-bg-panel: #18242b;
  border: 1px solid #5b8a96;
}
```
