# Action Bar

A bar that appears at the bottom of the screen with actions for the items a user
has selected.

```tsx
import { ActionBar } from '@leverui/components';
```

```tsx
<ActionBar.Root>
  <ActionBar.Positioner>
    <ActionBar.Content aria-label="Selection actions">
      <ActionBar.CloseTrigger />
      <ActionBar.SelectionTrigger />
      <ActionBar.Separator />
    </ActionBar.Content>
  </ActionBar.Positioner>
</ActionBar.Root>
```

## Props

### Root

| Prop                     | Default    | Type                                                              | Description                                                |
| ------------------------ | ---------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| `placement`              | `'bottom'` | `'bottom' \| 'bottom-start' \| 'bottom-end'` or responsive values | Position along the bottom of the screen.                   |
| `open`                   | —          | `boolean`                                                         | Open state, when you control it.                           |
| `defaultOpen`            | —          | `boolean`                                                         | Start open, when uncontrolled.                             |
| `onOpenChange`           | —          | `(details: ActionBarOpenChangeDetails) => void`                   | Called when the bar opens or closes.                       |
| `closeOnEscape`          | `true`     | `boolean`                                                         | Close on Escape.                                           |
| `closeOnInteractOutside` | `true`     | `boolean`                                                         | Close on click or focus outside.                           |
| `autoFocus`              | `false`    | `boolean`                                                         | Focus the first focusable item on open.                    |
| `restoreFocus`           | `true`     | `boolean`                                                         | Return focus to where it was on close.                     |
| `lazyMount`              | `true`     | `boolean`                                                         | Render the bar only once it first opens.                   |
| `unmountOnExit`          | `true`     | `boolean`                                                         | Remove the bar after its closing transition.               |
| `modal`                  | `false`    | `boolean`                                                         | Block the page and trap focus while open.                  |
| `unstyled`               | `false`    | `boolean`                                                         | Turn off the Lever UI styles.                              |
| `finalFocusEl`           | —          | `() => Element \| null`                                           | Returns the element to focus after close.                  |
| `initialFocusEl`         | —          | `() => HTMLElement \| null \| false`                              | Returns the element to focus on open. `false` skips focus. |
| `id`                     | —          | `string`                                                          | Unique ID.                                                 |
| `ids`                    | —          | Object of part IDs                                                | Your own part IDs, replacing the generated ones.           |
| `immediate`              | —          | `boolean`                                                         | Apply show and hide changes right away.                    |
| `onEscapeKeyDown`        | —          | `(event: KeyboardEvent) => void`                                  | Called on Escape.                                          |
| `onFocusOutside`         | —          | `(event: FocusOutsideEvent) => void`                              | Called when focus moves outside the bar.                   |
| `onInteractOutside`      | —          | `(event: InteractOutsideEvent) => void`                           | Called on click or focus outside the bar.                  |
| `onPointerDownOutside`   | —          | `(event: PointerDownOutsideEvent) => void`                        | Called on pointer down outside the bar.                    |
| `onRequestDismiss`       | —          | `(event: LayerDismissEvent) => void`                              | Called when a parent layer asks the bar to close.          |
| `onExitComplete`         | —          | `() => void`                                                      | Called after the closing transition ends.                  |
| `persistentElements`     | —          | `Array<() => Element \| null>`                                    | Outside elements that stay usable while open.              |
| `present`                | —          | `boolean`                                                         | Rendered state, when you control it.                       |
| `skipAnimationOnMount`   | `false`    | `boolean`                                                         | Skip the opening animation on first mount.                 |
| `translations`           | —          | `IntlTranslations`                                                | Translated text for screen readers.                        |

`ActionBar.Root` behaves like Popover.

Custom layouts: `ActionBar.RootProvider`, `ActionBar.PropsProvider`,
`ActionBar.Context`, `useActionBarContext`.

Styling: pass `class`, set variables such as `--leverui-action-bar-offset`, or
target the stable `leverui-action-bar__*` classes.
