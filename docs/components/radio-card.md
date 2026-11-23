# Radio Card

A radio button laid out as a card, with room for a title, a description, and an
icon.

```tsx
import { RadioCard } from '@leverui/components';
```

```tsx
<RadioCard.Root>
  <RadioCard.Label />
  <RadioCard.Item>
    <RadioCard.ItemHiddenInput />
    <RadioCard.ItemControl>
      <RadioCard.ItemContent>
        <RadioCard.ItemText />
        <RadioCard.ItemDescription />
      </RadioCard.ItemContent>
      <RadioCard.ItemIndicator />
    </RadioCard.ItemControl>
  </RadioCard.Item>
</RadioCard.Root>
```

For one component with props, see the [snippet below](#closed-component).

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { RadioCard, type RadioCardItemProps } from '@leverui/components';

export type ClosedRadioCardItemProps = RadioCardItemProps & {
  icon?: JSX.Element;
  label?: JSX.Element;
  description?: JSX.Element;
  addon?: JSX.Element;
  indicator?: JSX.Element | null;
  indicatorPlacement?: 'start' | 'end' | 'inside' | undefined;
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement>;
};

export function RadioCardItem(props: ClosedRadioCardItemProps) {
  const item = omit(
    props,
    'icon',
    'label',
    'description',
    'addon',
    'indicator',
    'indicatorPlacement',
    'inputProps',
  );
  const placement = () => props.indicatorPlacement ?? 'end';
  const indicator = () =>
    props.indicator === null ? null : (props.indicator ?? <RadioCard.ItemIndicator />);

  return (
    <RadioCard.Item {...item}>
      <RadioCard.ItemHiddenInput {...props.inputProps} />
      <RadioCard.ItemControl>
        <Show when={placement() === 'start'}>{indicator()}</Show>
        <Show when={props.label || props.description || props.icon}>
          <RadioCard.ItemContent>
            {props.icon}
            <Show when={props.label}>
              <RadioCard.ItemText>{props.label}</RadioCard.ItemText>
            </Show>
            <Show when={props.description}>
              <RadioCard.ItemDescription>{props.description}</RadioCard.ItemDescription>
            </Show>
            <Show when={placement() === 'inside'}>{indicator()}</Show>
          </RadioCard.ItemContent>
        </Show>
        <Show when={placement() === 'end'}>{indicator()}</Show>
      </RadioCard.ItemControl>
      <Show when={props.addon}>
        <RadioCard.ItemAddon>{props.addon}</RadioCard.ItemAddon>
      </Show>
    </RadioCard.Item>
  );
}

export const RadioCardRoot = RadioCard.Root;
export const RadioCardLabel = RadioCard.Label;
export const RadioCardItemIndicator = RadioCard.ItemIndicator;
```

```tsx
<RadioCardRoot>
  <RadioCardLabel />
  <RadioCardItem />
</RadioCardRoot>
```

## Guides

### State and forms

Give each item its own `value` and an `ItemHiddenInput`. Set `name` on the root
for forms. `ItemText` names the native input. A click anywhere on the item's
label selects it.

`defaultValue` sets the first selection. Use `value` and `onValueChange` when a
signal holds the value. `disabled` goes on the root or on one item. `required`,
`invalid`, and `readOnly` work as in a radio group. `Context` and `ItemContext`
give the reactive state.

To own the state machine, call `useRadioCardGroup()` in a component and pass its
accessor to `RootProvider`. `PropsProvider` takes default props as an object or
an accessor. A prop on a component wins. `RootProvider` takes presentation
defaults from `PropsProvider` and keeps your machine.

### Custom selected indicator

`ItemIndicator` takes a `checked` render function. It puts the indicator
classes, attributes, and ref on your own element. `getProps` takes attributes
that HTML and SVG share. Put SVG-only ones such as `viewBox` on the SVG itself.

`children` does not replace the default radio dot. With `checked`, you cannot
use `as` or `asChild`.

```tsx
<RadioCard.ItemIndicator checked={(getProps) => <CheckIcon {...getProps()} />} />
```

## Props

### Root

| Prop            | Default      | Type                                            | Description                                                |
| --------------- | ------------ | ----------------------------------------------- | ---------------------------------------------------------- |
| `orientation`   | `horizontal` | `'vertical' \| 'horizontal'`                    | Layout and arrow-key direction. One value, not responsive. |
| `colorPalette`  | `gray`       | `string`                                        | Color palette, built-in or your own.                       |
| `size`          | `md`         | `'sm' \| 'md' \| 'lg'`                          | Card size. Responsive.                                     |
| `variant`       | `outline`    | `'surface' \| 'subtle' \| 'outline' \| 'solid'` | Card style. Responsive.                                    |
| `align`         | `start`      | `'start' \| 'end' \| 'center'`                  | Content alignment. Responsive.                             |
| `as`            | `div`        | Native HTML tag                                 | HTML tag to render.                                        |
| `asChild`       | —            | Solid render function                           | Render your own element with the root's props.             |
| `unstyled`      | `false`      | `boolean`                                       | Turn off the Lever UI styles.                              |
| `defaultValue`  | —            | `string`                                        | Value selected at first, when you do not control it.       |
| `disabled`      | —            | `boolean`                                       | Disable the radio group.                                   |
| `form`          | —            | `string`                                        | Id of the form the inputs belong to.                       |
| `id`            | —            | `string`                                        | Unique id of the state machine.                            |
| `ids`           | —            | Element ID map                                  | Your own ids for the elements.                             |
| `invalid`       | —            | `boolean`                                       | Mark the radio group as invalid.                           |
| `name`          | —            | `string`                                        | Input name sent with the form.                             |
| `onValueChange` | —            | `(details) => void`                             | Called when a radio is checked.                            |
| `readOnly`      | —            | `boolean`                                       | Make the radio group read-only.                            |
| `required`      | —            | `boolean`                                       | Mark the radio group as required.                          |
| `value`         | —            | `string`                                        | Selected value, when you control it.                       |
| `justify`       | —            | `'start' \| 'end' \| 'center'`                  | Content justification. Responsive.                         |

## Customize with CSS

Import `@leverui/components/styles.css`, then override the `--lui-*` tokens
or style the part classes. The class names are stable.

```css
.leverui-radio-card__itemControl {
  border-radius: 0.75rem;
}
```

The root and items have `data-size` and `data-variant`, plus a version of each
for every breakpoint. The indicator also has `.leverui-radiomark`.

Variables for one group: `--lui-radio-card-root-gap`,
`--lui-radio-card-radius`, `--lui-radio-card-control-padding`,
`--lui-radio-card-control-gap`.

Every public part takes `class`, `style`, and `unstyled`.

## Explorer

Click a part name to highlight it in the preview.
