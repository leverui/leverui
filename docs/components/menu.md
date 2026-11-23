# Menu

A list of actions that opens from a button, such as Edit, Duplicate, and Delete.

```tsx
import { Menu } from '@leverui/components';
```

```tsx
<Menu.Root>
  <Menu.Trigger />
  <Menu.Positioner>
    <Menu.Content>
      <Menu.Item />

      <Menu.ItemGroup>
        <Menu.Item />
      </Menu.ItemGroup>

      <Menu.Separator />
      <Menu.Arrow />

      <Menu.CheckboxItem>
        <Menu.ItemIndicator />
      </Menu.CheckboxItem>

      <Menu.RadioItemGroup>
        <Menu.RadioItem>
          <Menu.ItemIndicator />
        </Menu.RadioItem>
      </Menu.RadioItemGroup>
    </Menu.Content>
  </Menu.Positioner>
</Menu.Root>
```

## Guide

### Styling highlighted items

An item is highlighted while the pointer is over it or the keyboard has moved
to it. Style `[data-highlighted]`.

```tsx
<Menu.Item value="custom" class="custom-highlight">
  Custom highlighted item
</Menu.Item>
```

```css
.custom-highlight[data-highlighted] {
  background: var(--lui-colors-blue-500);
  color: white;
}
```

### Styling open state

Style `[data-state='open']` on the trigger.

```tsx
<Menu.Trigger
  asChild={(getProps) => (
    <Button {...getProps()} class="custom-trigger">
      Menu
    </Button>
  )}
/>
```

```css
.custom-trigger[data-state='open'] {
  background: var(--lui-colors-blue-500);
  color: white;
}
```

## Props

### Root

| Prop                      | Default  | Type                                                                                                                                                                                                                                                                    | Description                                                                   |
| ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `closeOnSelect`           | `true`   | `boolean`                                                                                                                                                                                                                                                               | Close when an item is selected.                                               |
| `lazyMount`               | `true`   | `boolean`                                                                                                                                                                                                                                                               | Render the content only once the menu first opens.                            |
| `typeahead`               | `true`   | `boolean`                                                                                                                                                                                                                                                               | Typing moves to the matching item.                                            |
| `unmountOnExit`           | `true`   | `boolean`                                                                                                                                                                                                                                                               | Remove the content from the page on close.                                    |
| `variant`                 | `subtle` | `'subtle' \| 'solid'`                                                                                                                                                                                                                                                   | Menu style.                                                                   |
| `size`                    | `md`     | `'sm' \| 'md'`                                                                                                                                                                                                                                                          | Menu size.                                                                    |
| `unstyled`                | —        | `boolean`                                                                                                                                                                                                                                                               | Turn off the default styles.                                                  |
| `anchorPoint`             | —        | `Point`                                                                                                                                                                                                                                                                 | Point to position the menu at. The context menu or button trigger can set it. |
| `aria-label`              | —        | `string`                                                                                                                                                                                                                                                                | Accessible label.                                                             |
| `defaultHighlightedValue` | —        | `string`                                                                                                                                                                                                                                                                | Item highlighted at first. Uncontrolled.                                      |
| `defaultOpen`             | —        | `boolean`                                                                                                                                                                                                                                                               | Open at first. Uncontrolled.                                                  |
| `defaultTriggerValue`     | —        | `string`                                                                                                                                                                                                                                                                | Trigger value at first. Uncontrolled.                                         |
| `highlightedValue`        | —        | `string`                                                                                                                                                                                                                                                                | Highlighted item. Controlled.                                                 |
| `id`                      | —        | `string`                                                                                                                                                                                                                                                                | Unique id.                                                                    |
| `ids`                     | —        | `Partial<{ trigger: string \| ((value?: string \| undefined) => string); contextTrigger: string \| ((value?: string \| undefined) => string); content: string; groupLabel: (id: string) => string; group: (id: string) => string; positioner: string; arrow: string }>` | Ids of the menu's elements. For combining with other components.              |
| `immediate`               | —        | `boolean`                                                                                                                                                                                                                                                               | Apply a `present` change right away, not on the next frame.                   |
| `loopFocus`               | `false`  | `boolean`                                                                                                                                                                                                                                                               | Wrap keyboard navigation from the last item to the first.                     |
| `navigate`                | —        | `(details: NavigateDetails) => void`                                                                                                                                                                                                                                    | Called to go to the selected item when it is a link.                          |
| `onEscapeKeyDown`         | —        | `(event: KeyboardEvent) => void`                                                                                                                                                                                                                                        | Called when Escape is pressed.                                                |
| `onExitComplete`          | —        | `VoidFunction`                                                                                                                                                                                                                                                          | Called when the closing animation ends.                                       |
| `onFocusOutside`          | —        | `(event: FocusOutsideEvent) => void`                                                                                                                                                                                                                                    | Called when focus moves outside.                                              |
| `onHighlightChange`       | —        | `(details: HighlightChangeDetails) => void`                                                                                                                                                                                                                             | Called when the highlighted item changes.                                     |
| `onInteractOutside`       | —        | `(event: InteractOutsideEvent) => void`                                                                                                                                                                                                                                 | Called on an interaction outside.                                             |
| `onOpenChange`            | —        | `(details: OpenChangeDetails) => void`                                                                                                                                                                                                                                  | Called when the menu opens or closes.                                         |
| `onPointerDownOutside`    | —        | `(event: PointerDownOutsideEvent) => void`                                                                                                                                                                                                                              | Called when the pointer is pressed outside.                                   |
| `onRequestDismiss`        | —        | `(event: LayerDismissEvent) => void`                                                                                                                                                                                                                                    | Called when this layer closes because a parent layer closed.                  |
| `onSelect`                | —        | `(details: SelectionDetails) => void`                                                                                                                                                                                                                                   | Called when an item is selected.                                              |
| `onTriggerValueChange`    | —        | `(details: TriggerValueChangeDetails) => void`                                                                                                                                                                                                                          | Called when the trigger value changes.                                        |
| `open`                    | —        | `boolean`                                                                                                                                                                                                                                                               | Open state. Controlled.                                                       |
| `positioning`             | —        | `PositioningOptions`                                                                                                                                                                                                                                                    | Placement options.                                                            |
| `present`                 | —        | `boolean`                                                                                                                                                                                                                                                               | Present state. Controlled.                                                    |
| `skipAnimationOnMount`    | `false`  | `boolean`                                                                                                                                                                                                                                                               | Skip the animation on first show.                                             |
| `triggerValue`            | —        | `string`                                                                                                                                                                                                                                                                | Trigger value. Controlled.                                                    |

### Item

| Prop            | Default | Type                  | Description                                                        |
| --------------- | ------- | --------------------- | ------------------------------------------------------------------ |
| `value`         | —       | `string`              | Unique value for the item. Required.                               |
| `as`            | `div`   | Native tag            | HTML tag to render.                                                |
| `asChild`       | —       | Solid render function | Render your own element with the item's props.                     |
| `closeOnSelect` | —       | `boolean`             | Close the menu when this item is selected.                         |
| `disabled`      | —       | `boolean`             | Disable the item.                                                  |
| `onSelect`      | —       | `VoidFunction`        | Called when the item is selected.                                  |
| `valueText`     | —       | `string`              | Text matched when someone types. Default: the item's text content. |

Give each item a `value` that does not change and a clear name. Run actions in
`onSelect`. Links can be native `a` elements. Do not put a navigation link that
must stay visible only in a menu.

## Customize with CSS

Styles ship for `size="sm" | "md"` and `variant="subtle" | "solid"`. Both take
one value, an array with a value per breakpoint, or an object keyed by
breakpoint name.

Each part has a `lui-menu__<part>` class, a part attribute (such as
`data-menu-content`), and size and variant attributes. Menus in a portal and
nested menus keep them.

```tsx
<Menu.Content class="account-menu" style={{ 'max-height': '20rem' }}>
  ...
</Menu.Content>
```

```css
.account-menu {
  --lui-menu-background: var(--lui-colors-bg-subtle);
}
```

Variables: `--lui-menu-background`, `--lui-menu-z-index`,
`--lui-menu-highlight-background`, `--lui-menu-highlight-color`.
`unstyled` on `Root` or a part turns off its default styles.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
