# Popover

A small panel that opens next to a button, with content the user can interact
with.

```tsx
import { Popover } from '@leverui/components';
```

```tsx
<Popover.Root>
  <Popover.Trigger />
  <Popover.Positioner>
    <Popover.Content>
      <Popover.CloseTrigger />
      <Popover.Arrow>
        <Popover.ArrowTip />
      </Popover.Arrow>
      <Popover.Body>
        <Popover.Title />
      </Popover.Body>
    </Popover.Content>
  </Popover.Positioner>
</Popover.Root>
```

## Shortcuts

### Arrow

`Popover.Arrow` renders `Popover.ArrowTip` inside itself by default.

```tsx
<Popover.Arrow>
  <Popover.ArrowTip />
</Popover.Arrow>
```

```tsx
<Popover.Arrow />
```

## Guide

### Accessing popover context

`usePopoverContext` reads the popover's state and methods from any component
inside it. It returns an accessor, so call it to get the current value.

```tsx
import { Popover, usePopoverContext } from '@leverui/components';
function PopoverStatus() {
  const popover = usePopoverContext();
  return <div>Popover is {popover().open ? 'open' : 'closed'}</div>;
}

const MyPopover = () => (
  <Popover.Root>
    <Popover.Trigger>Open</Popover.Trigger>
    <Popover.Positioner>
      <Popover.Content>
        <PopoverStatus />
      </Popover.Content>
    </Popover.Positioner>
  </Popover.Root>
);
```

### Closing programmatically

Call `setOpen(false)` on the context.

```tsx
import { Button, Popover, usePopoverContext } from '@leverui/components';
function CloseButton() {
  const popover = usePopoverContext();
  return <Button onClick={() => popover().setOpen(false)}>Close Popover</Button>;
}

const MyPopover = () => (
  <Popover.Root>
    <Popover.Trigger>Open</Popover.Trigger>
    <Popover.Positioner>
      <Popover.Content>
        <CloseButton />
      </Popover.Content>
    </Popover.Positioner>
  </Popover.Root>
);
```

### Positioning based on ref

Return another element's position from `positioning.getAnchorRect()`.

```tsx
import { Popover } from '@leverui/components';
function MyPopover() {
  let anchor: HTMLDivElement | undefined;
  return (
    <>
      <div ref={anchor}>Anchor Element</div>
      <Popover.Root
        positioning={{
          getAnchorRect() {
            return anchor?.getBoundingClientRect() ?? null;
          },
        }}
      >
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>This popover is anchored to the div above</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </>
  );
}
```

## Props

### Root

| Prop                     | Default | Type                                           | Description                                                                                    |
| ------------------------ | ------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `autoFocus`              | `true`  | `boolean`                                      | Focus the first focusable element on open.                                                     |
| `closeOnEscape`          | `true`  | `boolean`                                      | Close on Escape.                                                                               |
| `closeOnInteractOutside` | `true`  | `boolean`                                      | Close on a click outside.                                                                      |
| `restoreFocus`           | `true`  | `boolean`                                      | Return focus to where it was before opening.                                                   |
| `size`                   | `'md'`  | `'xs' \| 'sm' \| 'md' \| 'lg'`                 | Popover size.                                                                                  |
| `unstyled`               | —       | `boolean`                                      | Turn off the Lever UI styles.                                                                  |
| `defaultOpen`            | —       | `boolean`                                      | Open on first render. Uncontrolled.                                                            |
| `defaultTriggerValue`    | —       | `string`                                       | Trigger value on first render. Uncontrolled.                                                   |
| `finalFocusEl`           | —       | `() => MaybeElement`                           | Element focused on close.                                                                      |
| `id`                     | —       | `string`                                       | Unique id.                                                                                     |
| `ids`                    | —       | Element ID map                                 | Ids for the popover's parts.                                                                   |
| `immediate`              | —       | `boolean`                                      | Apply `present` changes now, not next frame.                                                   |
| `initialFocusEl`         | —       | `() => HTMLElement \| null`                    | Element focused on open.                                                                       |
| `lazyMount`              | `false` | `boolean`                                      | Render the content on first open.                                                              |
| `modal`                  | `false` | `boolean`                                      | Block outside interaction and scrolling, hide the page from screen readers, keep focus inside. |
| `onEscapeKeyDown`        | —       | `(event: KeyboardEvent) => void`               | Called when Escape is pressed.                                                                 |
| `onExitComplete`         | —       | `VoidFunction`                                 | Called when the closing animation ends.                                                        |
| `onFocusOutside`         | —       | `(event: FocusOutsideEvent) => void`           | Called when focus moves outside.                                                               |
| `onInteractOutside`      | —       | `(event: InteractOutsideEvent) => void`        | Called on interaction outside.                                                                 |
| `onOpenChange`           | —       | `(details: OpenChangeDetails) => void`         | Called when the popover opens or closes.                                                       |
| `onPointerDownOutside`   | —       | `(event: PointerDownOutsideEvent) => void`     | Called on pointer down outside.                                                                |
| `onRequestDismiss`       | —       | `(event: LayerDismissEvent) => void`           | Called when this layer closes because a parent layer closed.                                   |
| `onTriggerValueChange`   | —       | `(details: TriggerValueChangeDetails) => void` | Called when the trigger value changes.                                                         |
| `open`                   | —       | `boolean`                                      | Controlled open state.                                                                         |
| `persistentElements`     | —       | `(() => Element \| null)[]`                    | Elements that keep pointer events and do not close the popover.                                |
| `positioning`            | —       | `PositioningOptions`                           | Positioning options for the content.                                                           |
| `present`                | —       | `boolean`                                      | Controlled presence of the content.                                                            |
| `skipAnimationOnMount`   | `false` | `boolean`                                      | Skip the animation on first appearance.                                                        |
| `translations`           | —       | `IntlTranslations`                             | Translated screen reader text for parts and states.                                            |
| `triggerValue`           | —       | `string`                                       | Controlled trigger value.                                                                      |
| `unmountOnExit`          | `false` | `boolean`                                      | Remove the content from the page on close.                                                     |

### Trigger

| Prop      | Default  | Type                  | Description                                       |
| --------- | -------- | --------------------- | ------------------------------------------------- |
| `as`      | `button` | Native HTML tag       | HTML tag to render.                               |
| `asChild` | —        | Solid render function | Render your own element with the trigger's props. |
| `value`   | —        | `string`              | Identifies this trigger.                          |

`Title` names the panel and `Description` explains it. Keep portaled content
inside the [theme scope](theme.md) it needs. Use [Dialog](dialog.md) for modal
work.

## Customize with CSS

Load the [package stylesheet](../getting-started.md) first. Set `class` or
`style` on any part, or override the variables on `Popover.Content`.

```css
.account-popover {
  --lui-popover-background: #f5f8ff;
  --lui-popover-size: 24rem;
  --lui-popover-padding: 1.25rem;
}
```

The arrow takes the content's background. `size` is responsive. `unstyled`
turns off the default styles but keeps focus and closing behavior.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
