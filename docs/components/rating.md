# Rating

Lets the user give a score with stars or another icon.

```tsx
import { RatingGroup } from '@leverui/components';
```

```tsx
<RatingGroup.Root>
  <RatingGroup.Label />
  <RatingGroup.HiddenInput />
  <RatingGroup.Control>
    <RatingGroup.Item>
      <RatingGroup.ItemIndicator />
    </RatingGroup.Item>
  </RatingGroup.Control>
</RatingGroup.Root>
```

For one ready-made component, see the [snippet below](#closed-component).

## Shortcuts

### RatingControl

`RatingGroup.Control` renders as many rating items as `count` says.

```tsx
<RatingGroup.Control>
  <For each={Array.from({ length: 5 })} keyed={false}>
    {(_, index) => (
      <RatingGroup.Item index={index + 1}>
        <RatingGroup.ItemIndicator />
      </RatingGroup.Item>
    )}
  </For>
</RatingGroup.Control>
```

```tsx
<RatingGroup.Control />
```

## Closed Component

```tsx
import { For, Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { RatingGroup, type RatingGroupIcon, type RatingGroupRootProps } from '@leverui/components';

export type RatingProps = RatingGroupRootProps & {
  icon?: RatingGroupIcon | undefined;
  count?: number | undefined;
  label?: JSX.Element;
};

export function Rating(props: RatingProps) {
  const count = () => props.count ?? 5;
  const root = omit(props, 'icon', 'count', 'label');
  return (
    <RatingGroup.Root count={count()} {...root}>
      <Show when={props.label}>
        <RatingGroup.Label>{props.label}</RatingGroup.Label>
      </Show>
      <RatingGroup.HiddenInput />
      <RatingGroup.Control>
        <For each={Array.from({ length: count() })} keyed={false}>
          {(_, index) => (
            <RatingGroup.Item index={index + 1}>
              <RatingGroup.ItemIndicator {...(props.icon ? { icon: props.icon } : {})} />
            </RatingGroup.Item>
          )}
        </For>
      </RatingGroup.Control>
    </RatingGroup.Root>
  );
}
```

```tsx
<Rating defaultValue={3} size="sm" />
```

## Guides

### Forms

In a form, give the root a `name` and include `HiddenInput`. `readOnly`: the
score cannot change but is still sent in `FormData`. `disabled`: no score can
be picked and the value is left out. `required` marks the hidden input as
required. An untouched rating has the value `-1`, which the form counts as
filled in. Check the score yourself when one is required.

### Hover and keyboard

`onHoverChange` reports the score under the pointer in `hoveredValue`, and `-1`
when the pointer leaves. Hovering selects nothing. Arrow keys move the selected
score. The label names the group of radio items. The default item names count
stars. Change them with `translations.ratingValueText`.

### Custom icons

Pass an icon component to `ItemIndicator` with `icon={MyIcon}`. It receives SVG
attributes, including `data-bg` or `data-fg`, and must spread them onto its
SVG. The icon renders twice: a background layer and a foreground layer.

### Right-to-left

Half ratings follow the text direction: which half is filled, and how the
pointer and arrow keys work. Wrap the group in `LocaleProvider locale="ar-EG"`
so the rating logic and the CSS use the same direction.

## Props

### Root

| Prop            | Default | Type                           | Description                                       |
| --------------- | ------- | ------------------------------ | ------------------------------------------------- |
| `count`         | `5`     | `number`                       | Number of rating items.                           |
| `colorPalette`  | `gray`  | `string`                       | Color palette, built-in or your own.              |
| `size`          | `md`    | `'xs' \| 'sm' \| 'md' \| 'lg'` | Rating size. Responsive.                          |
| `as`            | `div`   | Native HTML tag                | HTML tag to render.                               |
| `asChild`       | —       | Solid render function          | Render your own element with the rating's props.  |
| `unstyled`      | `false` | `boolean`                      | Turn off the Lever UI styles.                     |
| `allowHalf`     | —       | `boolean`                      | Allow half stars.                                 |
| `autoFocus`     | —       | `boolean`                      | Focus the rating on first render.                 |
| `defaultValue`  | —       | `number`                       | Initial rating. Uncontrolled.                     |
| `disabled`      | —       | `boolean`                      | Disable the rating.                               |
| `form`          | —       | `string`                       | ID of the form the input belongs to.              |
| `id`            | —       | `string`                       | Unique ID for the state machine.                  |
| `ids`           | —       | Element ID map                 | Your own IDs for the rating elements.             |
| `name`          | —       | `string`                       | Input name in the submitted form.                 |
| `onHoverChange` | —       | `(details) => void`            | Called when the hovered rating changes.           |
| `onValueChange` | —       | `(details) => void`            | Called when the rating value changes.             |
| `readOnly`      | —       | `boolean`                      | Make the rating read-only.                        |
| `required`      | —       | `boolean`                      | Mark the rating as required.                      |
| `translations`  | —       | `IntlTranslations`             | Translated text for accessible labels and states. |
| `value`         | —       | `number`                       | Controlled rating value.                          |

### Item

| Prop               | Default | Type                  | Description                                    |
| ------------------ | ------- | --------------------- | ---------------------------------------------- |
| `index` (required) | —       | `number`              | Rating value of this item, from 1.             |
| `as`               | `span`  | Native HTML tag       | HTML tag to render.                            |
| `asChild`          | —       | Solid render function | Render your own element with the item's props. |

## Customize with CSS

Classes: `.lui-rating-group__root`, `__label`, `__control`, `__item`,
`__itemIndicator`. The root has `data-size`, a `data-size-*` attribute for each
breakpoint, and attributes for selection, hover, disabled, and focus. The
indicator has `data-highlighted`, `data-checked`, and `data-half`.

Per-group variables: `--lui-rating-group-item-font-size`,
`--lui-rating-group-item-line-height`,
`--lui-rating-group-background-color`,
`--lui-rating-group-foreground-color`.

```css
.product-rating {
  --lui-rating-group-foreground-color: #ef4444;
  --lui-rating-group-background-color: #e5e7eb;
  --lui-rating-group-item-font-size: 1.75rem;
}
```

`class` and `style` still work. `unstyled` turns off the default styles but
keeps the behavior and the part classes.
