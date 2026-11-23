# Drawer

A panel that slides in from an edge of the screen, such as a side menu or a
filter panel.

```tsx
import { Drawer, Portal } from '@leverui/components';
```

```tsx
<Drawer.Root>
  <Drawer.Trigger />
  <Portal>
    <Drawer.Backdrop />
    <Drawer.Positioner>
      <Drawer.Content>
        <Drawer.CloseTrigger />
        <Drawer.Header>
          <Drawer.Title />
        </Drawer.Header>
        <Drawer.Body />
        <Drawer.Footer />
      </Drawer.Content>
    </Drawer.Positioner>
  </Portal>
</Drawer.Root>
```

## Guides

### Accessibility and focus

Works like a dialog: focus stays inside while open, and it closes the same
ways. Keep `Title` and `Description` inside the content for screen readers.

Content in a `Portal` renders elsewhere on the page. Set any
[scoped theme](theme.md) variables there.

### Action triggers

`Drawer.ActionTrigger` runs your click handler, then closes the drawer.

### Shared defaults

`Drawer.RootPropsProvider` sets default props for the drawers inside it. A prop
on a drawer wins.

### Contained drawers

`contained` leaves a gap around the drawer and rounds its corners. Responsive,
with the same breakpoint arrays and objects as `size` and `placement`.

`true` applies across its whole range, and a later `false` does not cancel a
`true` that still matches. To stop the gap at a breakpoint, use a range that
ends there.

```tsx
<Drawer.Root contained={{ mdDown: true }}>{/* Drawer parts */}</Drawer.Root>
```

## Props

### Root

| Prop                     | Default    | Type                                             | Description                                                  |
| ------------------------ | ---------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `closeOnEscape`          | `true`     | `boolean`                                        | Close on Escape.                                             |
| `closeOnInteractOutside` | `true`     | `boolean`                                        | Close on outside click.                                      |
| `lazyMount`              | `true`     | `boolean`                                        | Render the content on first open.                            |
| `modal`                  | `true`     | `boolean`                                        | Block outside clicks and hide all content below.             |
| `preventScroll`          | `true`     | `boolean`                                        | Stop the page behind from scrolling while open.              |
| `role`                   | `'dialog'` | `'dialog' \| 'alertdialog'`                      | ARIA role.                                                   |
| `trapFocus`              | `true`     | `boolean`                                        | Keep keyboard focus inside while open.                       |
| `unmountOnExit`          | `true`     | `boolean`                                        | Remove the content from the page on close.                   |
| `size`                   | `'xs'`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | Drawer size.                                                 |
| `placement`              | `'end'`    | `'start' \| 'end' \| 'top' \| 'bottom'`          | Screen edge the drawer slides in from.                       |
| `unstyled`               | —          | `boolean`                                        | Turn off the Lever UI styles.                                |
| `aria-label`             | —          | `string`                                         | Screen reader label. Use when there is no title.             |
| `defaultOpen`            | `false`    | `boolean`                                        | Open on first render. Uncontrolled.                          |
| `defaultTriggerValue`    | —          | `string`                                         | Active trigger on first render. Uncontrolled.                |
| `finalFocusEl`           | —          | `() => MaybeElement`                             | Element focused on close.                                    |
| `id`                     | —          | `string`                                         | Unique id of the drawer's state machine.                     |
| `ids`                    | —          | Element ID map                                   | Ids of the drawer's elements. For use with other components. |
| `initialFocusEl`         | —          | `() => MaybeElement`                             | Element focused on open.                                     |
| `onEscapeKeyDown`        | —          | `(event: KeyboardEvent) => void`                 | Called on Escape.                                            |
| `onExitComplete`         | —          | `VoidFunction`                                   | Called when the closing animation ends.                      |
| `onFocusOutside`         | —          | `(event: FocusOutsideEvent) => void`             | Called when focus moves outside.                             |
| `onInteractOutside`      | —          | `(event: InteractOutsideEvent) => void`          | Called on an interaction outside.                            |
| `onOpenChange`           | —          | `(details: OpenChangeDetails) => void`           | Called when the drawer opens or closes.                      |
| `onPointerDownOutside`   | —          | `(event: PointerDownOutsideEvent) => void`       | Called on pointer down outside.                              |
| `onRequestDismiss`       | —          | `(event: LayerDismissEvent) => void`             | Called when a parent layer closing closes the drawer.        |
| `onTriggerValueChange`   | —          | `(details: TriggerValueChangeDetails) => void`   | Called when the active trigger changes.                      |
| `open`                   | —          | `boolean`                                        | Open state. Controlled.                                      |
| `persistentElements`     | —          | `(() => Element \| null)[]`                      | Elements that stay clickable and do not close the drawer.    |
| `restoreFocus`           | —          | `boolean`                                        | Return focus to the element that had it before opening.      |
| `skipAnimationOnMount`   | `false`    | `boolean`                                        | Skip the opening animation when starting open.               |
| `triggerValue`           | —          | `string`                                         | Active trigger. Controlled.                                  |
| `contained`              | —          | `boolean`                                        | Leave a gap around the drawer and round its corners.         |

## Customize with CSS

Load the [package stylesheet](../getting-started.md) first. The root takes only
the listed `size`, `placement`, and `contained` values, plus `unstyled`. It
does not take a recipe object.

Every part has a fixed `.leverui-drawer__*` class. To style one drawer, use
`class` or Solid's `style` prop.

```tsx
<Drawer.Content class="settings-drawer">Settings</Drawer.Content>
```

```css
.settings-drawer {
  --lui-drawer-background: #f7f9ff;
}
```
