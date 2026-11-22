# Radio

Lets the user pick one option from a short list.

```tsx
import { RadioGroup } from '@leverui/components';
```

```tsx
<RadioGroup.Root>
  <RadioGroup.Item>
    <RadioGroup.ItemHiddenInput />
    <RadioGroup.ItemIndicator />
    <RadioGroup.ItemText />
  </RadioGroup.Item>
</RadioGroup.Root>
```

Want one component that takes props? See the
[snippet below](#closed-component).

## Closed Component

Wraps the parts of one radio item in one component.

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { RadioGroup as LeveruiRadioGroup, type RadioGroupItemProps } from '@leverui/components';

export type RadioProps = RadioGroupItemProps & {
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement>;
};

export function Radio(props: RadioProps) {
  const item = omit(props, 'children', 'inputProps');
  return (
    <LeveruiRadioGroup.Item {...item}>
      <LeveruiRadioGroup.ItemHiddenInput {...props.inputProps} />
      <LeveruiRadioGroup.ItemIndicator />
      <Show when={props.children}>
        <LeveruiRadioGroup.ItemText>{props.children}</LeveruiRadioGroup.ItemText>
      </Show>
    </LeveruiRadioGroup.Item>
  );
}

export const RadioGroup = LeveruiRadioGroup.Root;
```

```tsx
<RadioGroup>
  <Radio />
</RadioGroup>
```

## Guides

### Forms and state

Set `name` on the root to send the selected value with a form. `required` makes
people choose an option before the browser submits. `disabled` on the root or
an item blocks selection and leaves the input out of `FormData`. `readOnly`
keeps the selection but disables the native inputs, so the value is also left
out of `FormData`. To submit it, add a hidden input with the same `name` and
value. `invalid` marks the group invalid for assistive technology and CSS.

Every item needs an `ItemHiddenInput` and readable text, in `ItemText` or a
native label. `RootProvider` takes the accessor from your own `useRadioGroup`
call. `PropsProvider` sets default props, which can be reactive. `Context` and
`ItemContext` give you the current state. Use `ItemControl` for the visible
control when `ItemIndicator` does not give the look you want.

### Orientation

`orientation` sets the ARIA orientation only. Lay out the items in your own
CSS. Arrow keys work in either orientation.

## Props

### Root

| Prop            | Default | Type                               | Description                                                  |
| --------------- | ------- | ---------------------------------- | ------------------------------------------------------------ |
| `colorPalette`  | `gray`  | `string`                           | Color palette, built-in or your own.                         |
| `variant`       | `solid` | `'outline' \| 'subtle' \| 'solid'` | Radio style. Responsive.                                     |
| `size`          | `md`    | `'xs' \| 'sm' \| 'md' \| 'lg'`     | Radio size. Responsive.                                      |
| `as`            | `div`   | Native HTML tag                    | HTML tag to render.                                          |
| `asChild`       | —       | Solid render function              | Render your own element with the root's props.               |
| `unstyled`      | `false` | `boolean`                          | Turn off the Lever UI styles.                                |
| `defaultValue`  | —       | `string`                           | Selected value on first render, when uncontrolled.           |
| `disabled`      | —       | `boolean`                          | Disable the radio group.                                     |
| `form`          | —       | `string`                           | ID of the form the inputs belong to.                         |
| `id`            | —       | `string`                           | Unique ID for the radio group.                               |
| `ids`           | —       | Element ID map                     | Your own IDs for the elements, replacing the generated ones. |
| `invalid`       | —       | `boolean`                          | Mark the radio group invalid.                                |
| `name`          | —       | `string`                           | Input name submitted with the form.                          |
| `onValueChange` | —       | `(details) => void`                | Called when a radio is checked.                              |
| `orientation`   | —       | `'horizontal' \| 'vertical'`       | Group orientation.                                           |
| `readOnly`      | —       | `boolean`                          | Make the radio group read-only.                              |
| `required`      | —       | `boolean`                          | Mark the radio group required.                               |
| `value`         | —       | `string`                           | Selected value, when controlled.                             |

## Customize with CSS

Load your stylesheet after `@leverui/components/styles.css`.

```css
.my-radio-group {
  display: flex;
  gap: 1rem;
  --leverui-radio-group-item-gap: 0.75rem;
}

.leverui-radio-group__itemControl {
  border-radius: 0.5rem;
}
```

The root and every visible part have a `.leverui-radio-group__*` class. The
control also has `.leverui-radiomark` and shares its state CSS. `class` and
`style` work on the root and every part. `unstyled` turns off the default
styles and keeps the part hooks.
