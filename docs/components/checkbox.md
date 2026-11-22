# Checkbox

Lets the user turn an option on or off, or pick several options from a list.

```tsx
import { Checkbox } from '@leverui/components';
```

```tsx
<Checkbox.Root>
  <Checkbox.HiddenInput />
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label />
</Checkbox.Root>
```

For one ready-made component, see the [snippet below](#closed-component).

## Shortcuts

### CheckboxControl

`Checkbox.Control` renders a `Checkbox.Indicator` by default, so these two are
the same.

```tsx
<Checkbox.Control>
  <Checkbox.Indicator />
</Checkbox.Control>
```

```tsx
<Checkbox.Control />
```

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Checkbox, type CheckboxRootProps } from '@leverui/components';

export type ClosedCheckboxProps = CheckboxRootProps & {
  icon?: JSX.Element;
};

export function ClosedCheckbox(props: ClosedCheckboxProps) {
  const root = omit(props, 'icon', 'children');

  return (
    <Checkbox.Root {...root}>
      <Checkbox.HiddenInput />
      <Checkbox.Control>{props.icon ?? <Checkbox.Indicator />}</Checkbox.Control>
      <Show when={props.children}>
        <Checkbox.Label>{props.children}</Checkbox.Label>
      </Show>
    </Checkbox.Root>
  );
}
```

```tsx
<ClosedCheckbox>Accept terms and conditions</ClosedCheckbox>
```

## Guides

### CheckboxGroup + Field vs Fieldset

- **Single Checkbox**: wrap in `Field.Root` for a label and helper text.
- **CheckboxGroup**: wrap in `Fieldset.Root` with a legend, not `Field.Root`.

**Correct usage:**

```tsx
<Fieldset.Root>
  <CheckboxGroup name="framework">
    <Fieldset.Legend>Select framework</Fieldset.Legend>
    {/* ... checkboxes ... */}
  </CheckboxGroup>
</Fieldset.Root>
```

**Incorrect usage:**

```tsx
// Don't wrap CheckboxGroup with Field.Root
<Field.Root>
  <CheckboxGroup>{/* ... checkboxes ... */}</CheckboxGroup>
</Field.Root>
```

## Props

### Root

| Prop              | Default | Type                               | Description                                        |
| ----------------- | ------- | ---------------------------------- | -------------------------------------------------- |
| `value`           | `on`    | `string`                           | Value sent with the form.                          |
| `colorPalette`    | `gray`  | `string`                           | Color palette, built-in or your own.               |
| `size`            | `md`    | `'xs' \| 'sm' \| 'md' \| 'lg'`     | Checkbox size.                                     |
| `variant`         | `solid` | `'outline' \| 'solid' \| 'subtle'` | Checkbox style.                                    |
| `as`              | `label` | Native HTML tag                    | HTML tag to render.                                |
| `asChild`         | —       | Solid render function              | Render your own element with the checkbox's props. |
| `unstyled`        | `false` | `boolean`                          | Turn off the Lever UI styles.                      |
| `checked`         | —       | `CheckedState`                     | Checked state, when you control it.                |
| `defaultChecked`  | —       | `CheckedState`                     | Checked state on first render.                     |
| `disabled`        | —       | `boolean`                          | Disable the checkbox.                              |
| `form`            | —       | `string`                           | ID of the form the checkbox belongs to.            |
| `id`              | —       | `string`                           | Unique ID for the checkbox.                        |
| `ids`             | —       | Element ID map                     | Your own IDs in place of the generated ones.       |
| `invalid`         | —       | `boolean`                          | Mark the checkbox as invalid.                      |
| `name`            | —       | `string`                           | Name submitted with the form.                      |
| `onCheckedChange` | —       | `(details) => void`                | Called when the checked state changes.             |
| `readOnly`        | —       | `boolean`                          | Make the checkbox read-only.                       |
| `required`        | —       | `boolean`                          | Mark the checkbox as required.                     |

Keep `HiddenInput` in every Checkbox. It handles focus, validation, the
accessible label, and native form submission.

## Explorer

Click a part name to highlight it in the preview.
