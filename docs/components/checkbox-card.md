# Checkbox Card

A checkbox laid out as a card, with room for a title, a description, and an
icon.

```tsx
import { CheckboxCard } from '@leverui/components';
```

```tsx
<CheckboxCard.Root>
  <CheckboxCard.HiddenInput />
  <CheckboxCard.Control>
    <CheckboxCard.Content>
      <CheckboxCard.Label />
      <CheckboxCard.Description />
    </CheckboxCard.Content>
    <CheckboxCard.Indicator />
  </CheckboxCard.Control>
</CheckboxCard.Root>
```

For one component with props, see the [snippet below](#closed-component).

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { CheckboxCard, type CheckboxCardRootProps } from '@leverui/components';

export type ClosedCheckboxCardProps = CheckboxCardRootProps & {
  icon?: JSX.Element;
  label?: JSX.Element;
  description?: JSX.Element;
  addon?: JSX.Element;
  indicatorPlacement?: 'start' | 'end' | 'inside' | undefined;
};

export function ClosedCheckboxCard(props: ClosedCheckboxCardProps) {
  const root = omit(props, 'icon', 'label', 'description', 'addon', 'indicatorPlacement');
  const placement = () => props.indicatorPlacement ?? 'end';

  return (
    <CheckboxCard.Root {...root}>
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <Show when={placement() === 'start'}>
          <CheckboxCard.Indicator />
        </Show>
        <CheckboxCard.Content>
          {props.icon}
          <Show when={props.label}>
            <CheckboxCard.Label>{props.label}</CheckboxCard.Label>
          </Show>
          <Show when={props.description}>
            <CheckboxCard.Description>{props.description}</CheckboxCard.Description>
          </Show>
          <Show when={placement() === 'inside'}>
            <CheckboxCard.Indicator />
          </Show>
        </CheckboxCard.Content>
        <Show when={placement() === 'end'}>
          <CheckboxCard.Indicator />
        </Show>
      </CheckboxCard.Control>
      <Show when={props.addon}>
        <CheckboxCard.Addon>{props.addon}</CheckboxCard.Addon>
      </Show>
    </CheckboxCard.Root>
  );
}
```

```tsx
<ClosedCheckboxCard label="Checkbox Card" />
```

## Guides

### CheckboxGroup + Field vs Fieldset

- **Single CheckboxCard**: wrap in `Field.Root` for a label and helper text.
- **CheckboxGroup**: wrap in `Fieldset.Root` with a legend, not `Field.Root`.

**Correct usage:**

```tsx
<Fieldset.Root>
  <CheckboxGroup name="framework">
    <Fieldset.Legend>Select frameworks</Fieldset.Legend>
    {/* ... checkbox cards ... */}
  </CheckboxGroup>
</Fieldset.Root>
```

**Incorrect usage:**

```tsx
// Don't wrap CheckboxGroup with Field.Root
<Field.Root>
  <CheckboxGroup>{/* ... checkbox cards ... */}</CheckboxGroup>
</Field.Root>
```

## Props

### Root

| Prop              | Default      | Type                                            | Description                                    |
| ----------------- | ------------ | ----------------------------------------------- | ---------------------------------------------- |
| `value`           | `on`         | `string`                                        | Value sent with the form.                      |
| `colorPalette`    | `gray`       | `string`                                        | Color palette, built-in or your own.           |
| `size`            | `md`         | `'sm' \| 'md' \| 'lg'`                          | Card size.                                     |
| `variant`         | `outline`    | `'surface' \| 'subtle' \| 'outline' \| 'solid'` | Card style.                                    |
| `align`           | `start`      | `'start' \| 'end' \| 'center'`                  | Content alignment.                             |
| `orientation`     | `horizontal` | `'vertical' \| 'horizontal'`                    | Lay content out in a row or a column.          |
| `as`              | `label`      | Native HTML tag                                 | HTML tag to render.                            |
| `asChild`         | —            | Solid render function                           | Render your own element with the card's props. |
| `unstyled`        | `false`      | `boolean`                                       | Turn off the Lever UI styles.                  |
| `checked`         | —            | `CheckedState`                                  | Checked state, when you control it.            |
| `defaultChecked`  | —            | `CheckedState`                                  | Checked state on first render.                 |
| `disabled`        | —            | `boolean`                                       | Disable the checkbox.                          |
| `form`            | —            | `string`                                        | ID of the form the checkbox belongs to.        |
| `id`              | —            | `string`                                        | Unique ID for the checkbox.                    |
| `ids`             | —            | Element ID map                                  | Your own IDs in place of the generated ones.   |
| `invalid`         | —            | `boolean`                                       | Mark the checkbox as invalid.                  |
| `name`            | —            | `string`                                        | Name submitted with the form.                  |
| `onCheckedChange` | —            | `(details) => void`                             | Called when the checked state changes.         |
| `readOnly`        | —            | `boolean`                                       | Make the checkbox read-only.                   |
| `required`        | —            | `boolean`                                       | Mark the checkbox as required.                 |
| `justify`         | —            | `'start' \| 'end' \| 'center'`                  | Content justification.                         |

Keep `HiddenInput` in each card. It handles focus, validation, the accessible
label, and form submission.

## Explorer

Click a part name to highlight it in the preview.
