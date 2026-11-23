# Pin Input

A row of boxes for entering a short code, one character each, such as a sign-in
code.

```tsx
import { PinInput } from '@leverui/components';
```

```tsx
<PinInput.Root count={4}>
  <PinInput.HiddenInput />
  <PinInput.Control>
    <PinInput.Input />
  </PinInput.Control>
</PinInput.Root>
```

For one ready-made component, see the [snippet below](#closed-component).

## Closed Component

```tsx
import { For, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Group, PinInput as PinInputParts, type PinInputRootBaseProps } from '@leverui/components';

export type PinInputProps = Omit<PinInputRootBaseProps, 'attached'> & {
  count?: number;
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement>;
  attached?: boolean;
};

export function PinInput(props: PinInputProps) {
  const rest = omit(props, 'count', 'inputProps', 'attached');
  const indexes = () => Array.from({ length: props.count ?? 4 }, (_, index) => index);

  return (
    <PinInputParts.Root count={props.count ?? 4} {...rest}>
      <PinInputParts.HiddenInput {...props.inputProps} />
      <PinInputParts.Control>
        <Group attached={props.attached}>
          <For each={indexes()}>{(index) => <PinInputParts.Input index={index} />}</For>
        </Group>
      </PinInputParts.Control>
    </PinInputParts.Root>
  );
}
```

#### Usage

```tsx
<PinInput mask />
```

## Props

### Root

| Prop              | Default     | Type                                                     | Description                                                       |
| ----------------- | ----------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| `placeholder`     | `'○'`       | `string`                                                 | Placeholder in each input.                                        |
| `type`            | `'numeric'` | `'numeric' \| 'alphanumeric' \| 'alphabetic'`            | Characters the pin input accepts.                                 |
| `colorPalette`    | `'gray'`    | `string`                                                 | Color palette.                                                    |
| `size`            | `'md'`      | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | Input size.                                                       |
| `variant`         | `'outline'` | `'outline' \| 'subtle' \| 'flushed'`                     | Input style.                                                      |
| `as`              | —           | `'div'`                                                  | HTML tag to render.                                               |
| `asChild`         | —           | Solid render function                                    | Render your own element with the root's props.                    |
| `unstyled`        | —           | `boolean`                                                | Turn off the default styles.                                      |
| `autoFocus`       | —           | `boolean`                                                | Focus the first input when the pin input appears.                 |
| `autoSubmit`      | —           | `boolean`                                                | Submit the form once every input is filled.                       |
| `count`           | —           | `number`                                                 | Number of inputs. Lets the server render correct ARIA attributes. |
| `defaultValue`    | —           | `string[]`                                               | Starting value.                                                   |
| `disabled`        | —           | `boolean`                                                | Disable the inputs.                                               |
| `form`            | —           | `string`                                                 | Form the underlying input belongs to.                             |
| `id`              | —           | `string`                                                 | Unique id.                                                        |
| `ids`             | —           | Element ID map                                           | Ids of the elements inside.                                       |
| `invalid`         | —           | `boolean`                                                | Mark the pin input as invalid.                                    |
| `mask`            | —           | `boolean`                                                | Hide typed characters, like `type=password`.                      |
| `name`            | —           | `string`                                                 | Input `name`, for sending the value with a form.                  |
| `onValueChange`   | —           | `(details: ValueChangeDetails) => void`                  | Called when the value changes.                                    |
| `onValueComplete` | —           | `(details: ValueChangeDetails) => void`                  | Called when every input has a valid value.                        |
| `onValueInvalid`  | —           | `(details: ValueInvalidDetails) => void`                 | Called when an invalid value is entered.                          |
| `otp`             | —           | `boolean`                                                | Use `autocomplete="one-time-code"` on the inputs.                 |
| `pattern`         | —           | `string`                                                 | Regular expression the typed value is checked against.            |
| `readOnly`        | —           | `boolean`                                                | Make the pin input read-only.                                     |
| `required`        | —           | `boolean`                                                | Mark the pin input as required.                                   |
| `normalizeValue`  | —           | `(value: string) => string`                              | Clean a pasted value before it is checked.                        |
| `translations`    | —           | `IntlTranslations`                                       | Translated labels for assistive technology.                       |
| `value`           | —           | `string[]`                                               | Value, when you control it.                                       |
| `attached`        | —           | `boolean` or responsive object                           | Join the inputs into one group.                                   |

Each visible `Input` needs its own `index`, counting from 0. Set `count` so the
server renders the correct accessible labels. Add `HiddenInput` to send the
value with a form. The value is an array of strings.

`size`, `variant`, and `attached` take a value per breakpoint: base, `sm`, `md`,
`lg`, `xl`, and `2xl`. Pass an object, or an array that may skip breakpoints.

`readOnly` works on the root or on a `Field.Root` around it.
`PinInput.PropsProvider` sets default props for the roots inside it. A prop on a
root wins. To control the pin input from outside, call `usePinInput({ count })`
inside a Solid owner and pass the accessor to `PinInput.RootProvider`.

## Customize with CSS

Load the Lever UI stylesheet first. The class names are stable.

```css
.lui-pin-input__input {
  border-color: rebeccapurple;
}
```

The root, label, control, and input each have a `.lui-pin-input__*` class.
Each visible input also has `.lui-input`, so it gets the Input component's
styles. Set the `--lui-*` variables on a parent, or target a part class.

```css
.verification-code {
  --lui-colors-border: rebeccapurple;
}

.verification-code .lui-pin-input__input {
  background: lavender;
}
```

Use `class` and `style` for one-off changes. `unstyled` on the root or on a part
turns off its default styles.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
