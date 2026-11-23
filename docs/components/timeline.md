# Timeline

Lists events in order along a line, such as the history of an order.

```tsx
import { Timeline } from '@leverui/components';
```

```tsx
<Timeline.Root>
  <Timeline.Item>
    <Timeline.Connector>
      <Timeline.Separator />
      <Timeline.Indicator />
    </Timeline.Connector>
    <Timeline.Content>
      <Timeline.Title />
      <Timeline.Description />
    </Timeline.Content>
  </Timeline.Item>
</Timeline.Root>
```

## Guides

### Semantics

The root and the items are `div` elements. Default roles: `list` on the root,
`listitem` on each item. Set `role` on either to replace it. The root's ref is
an `HTMLDivElement`. Native attributes and events go to the part you set them
on.

### Content before the indicator

For a date or label beside the marker, put a `Timeline.Content` before
`Timeline.Connector` and a second one after it for the event. To alternate
sides, put a flexible content part on both sides of each connector and switch
the side that holds the event from item to item. An `Avatar.Root size="full"`
can fill an indicator. Interactive content, such as a button, can go inside
`Timeline.Content`.

### Responsive choices

`size` and `variant` are responsive, for example
`size={{ base: 'sm', md: 'lg' }}`. `showLastSeparator` defaults to `false`: no
line after the last item. Set it to `true` when the timeline carries on past
the last event shown.

### Reactive defaults

`Timeline.RootPropsProvider` sets default props for the roots inside it. Pass
an object, or a function when the defaults depend on signals. A prop on a root
wins. The part classes also work on plain HTML elements inside a Timeline root.

## Props

### Root

| Prop                | Default | Type                                             | Description                                    |
| ------------------- | ------- | ------------------------------------------------ | ---------------------------------------------- |
| `colorPalette`      | `gray`  | `string`                                         | Marker color palette.                          |
| `variant`           | `solid` | `'subtle' \| 'solid' \| 'outline' \| 'plain'`    | Marker style.                                  |
| `size`              | `md`    | `'sm' \| 'md' \| 'lg' \| 'xl'` or responsive map | Timeline size.                                 |
| `as`                | `div`   | Native HTML tag                                  | HTML tag to render.                            |
| `asChild`           | —       | Solid render function                            | Render your own element with the root's props. |
| `unstyled`          | `false` | `boolean`                                        | Turn off the Lever UI styles.                  |
| `showLastSeparator` | `false` | `boolean`                                        | Show the line after the last item.             |

## Customize with CSS

Import `@leverui/components/styles.css` first.

- `.lui-timeline__root`
- `.lui-timeline__item`
- `.lui-timeline__connector`
- `.lui-timeline__separator`
- `.lui-timeline__indicator`
- `.lui-timeline__content`
- `.lui-timeline__title`
- `.lui-timeline__description`

```css
.lui-timeline__title {
  letter-spacing: 0.01em;
}
```

The root has `data-size`, `data-variant`, and `data-show-last-separator`, plus
one per screen size you set, such as `data-size-md`. `class` and `style` work
on each part.

Set `--lui-timeline-indicator-size` on the root to resize the markers. The
connector line stays centered. Other variables:
`--lui-timeline-indicator-bg`, `--lui-timeline-indicator-color`,
`--lui-timeline-line-color`, `--lui-timeline-line-width`,
`--lui-timeline-item-gap`, `--lui-timeline-content-gap`,
`--lui-timeline-title-font-size`.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
