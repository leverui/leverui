# Hover Card

A card that opens when the user points at a link, with a preview of what it
leads to.

```tsx
import { HoverCard } from '@leverui/components';
```

```tsx
<HoverCard.Root>
  <HoverCard.Trigger />
  <HoverCard.Positioner>
    <HoverCard.Content>
      <HoverCard.Arrow>
        <HoverCard.ArrowTip />
      </HoverCard.Arrow>
    </HoverCard.Content>
  </HoverCard.Positioner>
</HoverCard.Root>
```

## Shortcuts

### Arrow

By default, `HoverCard.Arrow` renders `HoverCard.ArrowTip` inside itself.

```tsx
<HoverCard.Arrow>
  <HoverCard.ArrowTip />
</HoverCard.Arrow>
```

Shorter, if you keep the default tip:

```tsx
<HoverCard.Arrow />
```

## Accessibility

Extra information only. Screen readers do not announce the card as part of
the trigger, so the page must make sense without it.

Opens on hover or keyboard focus. Keep the trigger focusable and give links in
the card clear names. For a panel that opens on a click or key press, stays
open and takes interaction, use [Popover](popover.md).

## Props

### Root

| Prop                   | Default | Type                                            | Description                                                                |
| ---------------------- | ------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| `closeDelay`           | `300`   | `number`                                        | Milliseconds before closing after the mouse leaves the trigger or content. |
| `openDelay`            | `600`   | `number`                                        | Milliseconds before opening after the mouse enters the trigger.            |
| `size`                 | `'md'`  | `'xs' \| 'sm' \| 'md' \| 'lg'`                  | Hover card size.                                                           |
| `unstyled`             | —       | `boolean`                                       | Turn off the default styles. Behavior stays.                               |
| `defaultOpen`          | —       | `boolean`                                       | Open on first render.                                                      |
| `defaultTriggerValue`  | —       | `string`                                        | Trigger value on first render.                                             |
| `disabled`             | —       | `boolean`                                       | Disable the hover card.                                                    |
| `id`                   | —       | `string`                                        | Unique id.                                                                 |
| `ids`                  | —       | Element ID map                                  | Ids for the hover card's parts.                                            |
| `immediate`            | —       | `boolean`                                       | Apply `present` changes right away, not next frame.                        |
| `lazyMount`            | `false` | `boolean`                                       | Wait for the first open to render content.                                 |
| `onExitComplete`       | —       | `() => void`                                    | Called when the closing animation ends.                                    |
| `onFocusOutside`       | —       | `(event: FocusOutsideEvent) => void`            | Called when focus moves outside.                                           |
| `onInteractOutside`    | —       | `(event: InteractOutsideEvent) => void`         | Called on an interaction outside.                                          |
| `onOpenChange`         | —       | `(details: HoverCardOpenChangeDetails) => void` | Called when the hover card opens or closes.                                |
| `onPointerDownOutside` | —       | `(event: PointerDownOutsideEvent) => void`      | Called on pointer down outside.                                            |
| `onTriggerValueChange` | —       | `(details: TriggerValueChangeDetails) => void`  | Called when the trigger value changes.                                     |
| `open`                 | —       | `boolean`                                       | Open state, when you control it.                                           |
| `positioning`          | —       | `PositioningOptions`                            | Positioning options.                                                       |
| `present`              | —       | `boolean`                                       | Content presence, when you control it.                                     |
| `skipAnimationOnMount` | `false` | `boolean`                                       | Skip the animation the first time content appears.                         |
| `triggerValue`         | —       | `string`                                        | Trigger value, when you control it.                                        |
| `unmountOnExit`        | `false` | `boolean`                                       | Remove content from the page after close.                                  |

### Trigger

| Prop      | Default  | Type                  | Description                                       |
| --------- | -------- | --------------------- | ------------------------------------------------- |
| `as`      | `button` | Native HTML tag       | HTML tag to render.                               |
| `asChild` | —        | Solid render function | Render your own element with the trigger's props. |
| `value`   | —        | `string`              | Value that identifies this trigger.               |

`HoverCardPropsProvider` sets default props for the hover cards inside it.
`lazyMount` and `unmountOnExit` keep fewer hidden elements in the page.

## Customize with CSS

Set `class` or `style` on a part, or override its CSS variables.

```css
.profile-preview {
  --lui-hover-card-background: #f5f8ff;
  --lui-hover-card-padding: 1.25rem;
}
```

Put `class="profile-preview"` on `HoverCard.Content`. The arrow takes the
content's background. `size` can be responsive.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
