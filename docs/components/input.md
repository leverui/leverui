# Input

A single-line text field.

```tsx
import { Input } from '@leverui/components';
```

```tsx
<Input />
```

## Guides

### Native control

A plain HTML `input` with Lever UI styles. Inside `Field.Root`, the field gives
it the label and description IDs and the required, disabled, read-only, and
invalid states.

### Sizes and variants

`size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. Default: `md`. `variant`:
`outline`, `subtle`, `flushed`. Default: `outline`. Both take a value per
breakpoint (`sm`, `md`, `lg`, `xl`, `2xl`). Your CSS can select the
`data-size-*` and `data-variant-*` attributes they set on the input.

`InputPropsProvider` sets default props for the inputs inside it. The defaults
are reactive. A prop on an input wins.

### Field composition

```tsx
import { Field, Input } from '@leverui/components';

<Field.Root id="email" required>
  <Field.Label>Email</Field.Label>
  <Input type="email" />
  <Field.HelperText>We will send a receipt here.</Field.HelperText>
  <Field.ErrorText>Enter a valid email address.</Field.ErrorText>
</Field.Root>;
```

Set `invalid` or `disabled` on `Field.Root` to update the input and the state
screen readers announce. An input on its own accepts `required`, `disabled`,
and `readOnly`.

### Values in Solid

`defaultValue` sets a starting value and the input tracks its own text. To
control it, read `value` from a signal and update the signal in `onInput`. A
form reset restores `defaultValue`. A controlled input keeps following its
signal.

```tsx
import { createSignal } from 'solid-js';
import { Input } from '@leverui/components';

function AccountName() {
  const [name, setName] = createSignal('');

  function updateName(event: InputEvent & { currentTarget: HTMLInputElement }) {
    setName(event.currentTarget.value);
  }

  return <Input aria-label="Account name" value={name()} onInput={updateName} />;
}
```

`as="textarea"` renders a multiline `textarea` with its standard attributes and
ref type. `asChild` takes a Solid render function that receives the input's
merged props.

### Payment fields

`usePaymentInputs` formats and checks the card number, expiry date, and security
code as people type, and detects the card brand. Spread the props its functions
return onto `Input`, as in the Card Number and Card Details examples.

## Props

| Prop           | Default   | Type                                                                       | Description                                     |
| -------------- | --------- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| `colorPalette` | `gray`    | `string`                                                                   | Color palette, built-in or your own.            |
| `size`         | `md`      | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` or responsive map | Input size.                                     |
| `variant`      | `outline` | `'outline' \| 'subtle' \| 'flushed'` or responsive map                     | Input style.                                    |
| `as`           | `input`   | Native HTML tag                                                            | HTML tag to render.                             |
| `asChild`      | —         | Solid render function                                                      | Render your own element with the input's props. |
| `unstyled`     | `false`   | `boolean`                                                                  | Turn off the Lever UI styles.                   |

Also accepts the standard input attributes and events, a `ref`, `class`, and
`style`.

## Customize with CSS

Import your CSS after `styles.css`.

```css
.account-form {
  --leverui-colors-bg-muted: #f4f0fa;
}

.account-form .leverui-input {
  border-radius: 0.5rem;
}
```

Focus and invalid colors: set `--leverui-input-focus-color` or
`--leverui-input-error-color` on the input or an element that contains it.

Use `style` for a one-off change, `unstyled` to turn off the Lever UI styles,
and your own CSS to add variants. Input Addon, Element, and Group are separate
components that go around the input.
