# Field

Ties a form control to its label, help text, and error message.

```tsx
import { Field } from '@leverui/components';
```

```tsx
<Field.Root>
  <Field.Label>
    <Field.RequiredIndicator />
  </Field.Label>
  <Input />
  <Field.HelperText />
  <Field.ErrorText />
</Field.Root>
```

For one component that takes the label and messages as props, see the
[snippet below](#closed-component).

## Closed Component

Takes the label, helper text, and error text as props.

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Field as FieldParts, type FieldRootProps } from '@leverui/components';

export type FieldProps = FieldRootProps & {
  label?: JSX.Element;
  helperText?: JSX.Element;
  errorText?: JSX.Element;
  optionalText?: JSX.Element;
};

export function Field(props: FieldProps) {
  const root = omit(props, 'label', 'helperText', 'errorText', 'optionalText', 'children');

  return (
    <FieldParts.Root {...root}>
      <Show when={props.label}>
        <FieldParts.Label>
          {props.label}
          <FieldParts.RequiredIndicator fallback={props.optionalText} />
        </FieldParts.Label>
      </Show>
      {props.children}
      <Show when={props.helperText}>
        <FieldParts.HelperText>{props.helperText}</FieldParts.HelperText>
      </Show>
      <Show when={props.errorText}>
        <FieldParts.ErrorText>{props.errorText}</FieldParts.ErrorText>
      </Show>
    </FieldParts.Root>
  );
}
```

## Guides

The label is linked to the control inside the field. `required`, `disabled`,
`readOnly`, or `invalid` on `Field.Root` sets the same state on the control.
Helper and error text on the page are part of the control's accessible
description. `Field.ErrorText` shows only while `invalid` is true.

`Field.PropsProvider` sets default props for the fields inside it. The defaults
can change while the page is open. A prop on a field wins. To own the state
elsewhere, create it with `useField` and pass it to `Field.RootProvider`. Read
the nearest field's state with `Field.Context` or `useFieldContext`.

## Props

### Root

| Prop          | Default      | Type                         | Description                                      |
| ------------- | ------------ | ---------------------------- | ------------------------------------------------ |
| `orientation` | `'vertical'` | `'vertical' \| 'horizontal'` | Label above the control or beside it.            |
| `as`          | `div`        | Native tag name              | HTML tag to render.                              |
| `asChild`     | —            | Solid render function        | Render your own element with the field's props.  |
| `unstyled`    | —            | `boolean`                    | Turn off the Lever UI styles.                    |
| `disabled`    | —            | `boolean`                    | Disable the field.                               |
| `id`          | —            | `string`                     | Unique id for the field.                         |
| `ids`         | —            | `FieldElementIds`            | Ids of the field's parts.                        |
| `invalid`     | —            | `boolean`                    | Mark the field invalid.                          |
| `readOnly`    | —            | `boolean`                    | Make the field read-only.                        |
| `required`    | —            | `boolean`                    | Mark the field required.                         |
| `target`      | —            | `string`                     | `value` of the `Field.Item` the label points to. |

## Customize with CSS

Load the [package stylesheet](../getting-started.md) first. Classes:
`.leverui-field__root`, `__label`, `__helperText`, `__errorText`,
`__requiredIndicator`. Or add your own class to a part and style it after the
Lever UI stylesheet.

`--lui-field-label-width` sets the label column width in a horizontal
field. Default: `80px`.

```css
.account-form {
  --lui-colors-fg-error: #a02fd0;
  --lui-field-label-width: 96px;
}

.account-form .leverui-field__label {
  font-weight: 700;
}
```

`unstyled` turns off the styles so you can write your own. The root and the
parts pass native HTML attributes, `style`, and refs to their elements. `as`
picks the HTML tag. `asChild` renders your own element with Field's attributes.

## Explorer

Click a part name to highlight it in the preview.
