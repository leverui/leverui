# Number Input

A text field for numbers, with buttons to step the value up and down.

```tsx
import { NumberInput } from '@leverui/components';
```

```tsx
<NumberInput.Root>
  <NumberInput.Label />
  <NumberInput.ValueText />
  <NumberInput.Control>
    <NumberInput.IncrementTrigger />
    <NumberInput.DecrementTrigger />
  </NumberInput.Control>
  <NumberInput.Scrubber />
  <NumberInput.Input />
</NumberInput.Root>
```

For a single component, see the [snippet below](#closed-component).

## Shortcuts

### NumberInputControl

With no children, `NumberInput.Control` renders
`NumberInput.IncrementTrigger` and `NumberInput.DecrementTrigger`.

```tsx
<NumberInput.Control />
```

Same as:

```tsx
<NumberInput.Control>
  <NumberInput.IncrementTrigger />
  <NumberInput.DecrementTrigger />
</NumberInput.Control>
```

## Closed Component

One component that wraps the parts.

```tsx
import { omit } from 'solid-js';
import { NumberInput as NumberInputParts, type NumberInputRootProps } from '@leverui/components';

export function NumberInputRoot(props: NumberInputRootProps) {
  const rest = omit(props, 'children');

  return (
    <NumberInputParts.Root variant="outline" {...rest}>
      {props.children}
      <NumberInputParts.Control>
        <NumberInputParts.IncrementTrigger />
        <NumberInputParts.DecrementTrigger />
      </NumberInputParts.Control>
    </NumberInputParts.Root>
  );
}

export const NumberInputField = NumberInputParts.Input;
export const NumberInputScrubber = NumberInputParts.Scrubber;
export const NumberInputLabel = NumberInputParts.Label;
```

```tsx
<NumberInputRoot>
  <NumberInputField />
</NumberInputRoot>
```

## Guides

### Why use string values?

Keep a controlled value as a string, not a number. A string keeps the
formatting of the user's language and region, such as currency separators
(`1.523,30` and `1,523.30`).

```tsx
const [value, setValue] = createSignal('0');

<NumberInput.Root value={value()} onValueChange={(details) => setValue(details.value)}>
  {/* ... */}
</NumberInput.Root>;
```

To submit a number, read `valueAsNumber` from `NumberInput.Context`.

```tsx
<NumberInput.Root value={value()} onValueChange={(details) => setValue(details.value)}>
  <NumberInput.Input />
  <NumberInput.Context>
    {(context) => <input type="hidden" name="amount" value={context().valueAsNumber} />}
  </NumberInput.Context>
</NumberInput.Root>
```

## Props

### Root

| Prop                 | Default                   | Type                                                                                                                            | Description                                            |
| -------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `focusInputOnChange` | `true`                    | `boolean`                                                                                                                       | Focus the input when the value changes.                |
| `inputMode`          | `decimal`                 | `InputMode`                                                                                                                     | Data type hint. Picks the mobile keyboard.             |
| `largeStep`          | `10 * step`               | `number`                                                                                                                        | Step size while `Shift` is held.                       |
| `locale`             | `en-US`                   | `string`                                                                                                                        | BCP 47 tag used to format the number.                  |
| `max`                | `Number.MAX_SAFE_INTEGER` | `number`                                                                                                                        | Largest value allowed.                                 |
| `min`                | `Number.MIN_SAFE_INTEGER` | `number`                                                                                                                        | Smallest value allowed.                                |
| `pattern`            | `-?[0-9]*(.[0-9]+)?`      | `string`                                                                                                                        | Pattern the `<input>` value is checked against.        |
| `smallStep`          | `step / 10`               | `number`                                                                                                                        | Step size while `Alt` is held.                         |
| `spinOnPress`        | `true`                    | `boolean`                                                                                                                       | Keep stepping while a stepper button is held.          |
| `step`               | `1`                       | `number`                                                                                                                        | Step size.                                             |
| `colorPalette`       | `gray`                    | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'`                        | Color palette.                                         |
| `size`               | `md`                      | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                                                                  | Number input size.                                     |
| `variant`            | `outline`                 | `'outline' \| 'subtle' \| 'flushed'`                                                                                            | Number input style.                                    |
| `as`                 | `div`                     | Native tag                                                                                                                      | HTML tag to render.                                    |
| `asChild`            | —                         | Solid render function                                                                                                           | Render your own element with the root's props.         |
| `unstyled`           | —                         | `boolean`                                                                                                                       | Turn off the Lever UI styles.                          |
| `allowMouseWheel`    | —                         | `boolean`                                                                                                                       | Let the mouse wheel change the value.                  |
| `defaultValue`       | —                         | `string`                                                                                                                        | Starting value, when uncontrolled.                     |
| `disabled`           | —                         | `boolean`                                                                                                                       | Disable the number input.                              |
| `form`               | —                         | `string`                                                                                                                        | Form the input belongs to.                             |
| `formatOptions`      | —                         | `NumberFormatOptions`                                                                                                           | Options for `Intl.NumberFormat`.                       |
| `id`                 | —                         | `string`                                                                                                                        | Unique id.                                             |
| `ids`                | —                         | `Partial<{ root: string; label: string; input: string; incrementTrigger: string; decrementTrigger: string; scrubber: string }>` | Your own ids for the parts.                            |
| `invalid`            | —                         | `boolean`                                                                                                                       | Mark the value as invalid.                             |
| `name`               | —                         | `string`                                                                                                                        | Input `name`, sent with the value on submit.           |
| `onFocusChange`      | —                         | `(details: FocusChangeDetails) => void`                                                                                         | Called when focus changes.                             |
| `onValueChange`      | —                         | `(details: ValueChangeDetails) => void`                                                                                         | Called when the value changes.                         |
| `onValueCommit`      | —                         | `(details: ValueChangeDetails) => void`                                                                                         | Called when the value commits, on blur or Enter.       |
| `onValueInvalid`     | —                         | `(details: ValueInvalidDetails) => void`                                                                                        | Called when the value goes below `min` or above `max`. |
| `readOnly`           | —                         | `boolean`                                                                                                                       | Make the number input read-only.                       |
| `required`           | —                         | `boolean`                                                                                                                       | Mark the number input as required.                     |
| `translations`       | —                         | `IntlTranslations`                                                                                                              | Translated text for screen readers.                    |
| `value`              | —                         | `string`                                                                                                                        | Current value, when you control it.                    |

`NumberInput.PropsProvider` sets default props for every root inside it. The
defaults are reactive. A prop on a root wins.

For your own state machine, call `useNumberInput()` inside a Solid owner, such
as a component, and pass the result to `NumberInput.RootProvider`.

`ValueText` shows the formatted value. `Scrubber` changes the value by
dragging.

## Customize with CSS

Load the package CSS first. Then override the tokens or style the part
classes. The class names are stable.

```css
.leverui-number-input__input {
  border-color: rebeccapurple;
}
```

The root, input, control, triggers, scrubber, label, and value text each have a
`.leverui-number-input__*` class. The input also has `.leverui-input`, so it
gets the `Input` size, variant, focus, disabled, and invalid styles.

Root `size` and `variant` are responsive.

Stepper buttons: set `--leverui-number-input-stepper-width` or
`--leverui-number-input-stepper-radius` on the root.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
