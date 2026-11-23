# Fieldset

Groups related form fields under one legend, such as the parts of an address.

```tsx
import { Fieldset } from '@leverui/components';
```

```tsx
<Fieldset.Root>
  <Fieldset.Legend />
  <Fieldset.Content />
</Fieldset.Root>
```

## Guides

Renders a native `fieldset` with a `legend` that names the group. Helper text
joins the group's accessible description. Put controls in `Fieldset.Content`,
a styled `div`.

`disabled` on `Fieldset.Root` disables every form control inside. This is
native `fieldset` behavior, so keep the default tag if you rely on it.
`invalid` shows `Fieldset.ErrorText` and adds its id to the group's accessible
description.

Own the state: create it with `useFieldset` and pass it to
`Fieldset.RootProvider`. Read the nearest fieldset's state with
`Fieldset.Context` or `useFieldsetContext`. The state is reactive.

## Props

| Prop       | Default    | Type                   | Description                                        |
| ---------- | ---------- | ---------------------- | -------------------------------------------------- |
| `size`     | `'md'`     | `'sm' \| 'md' \| 'lg'` | Fieldset size.                                     |
| `as`       | `fieldset` | Native tag name        | HTML tag to render.                                |
| `asChild`  | —          | Solid render function  | Render your own element with the fieldset's props. |
| `unstyled` | —          | `boolean`              | Turn off the Lever UI styles.                      |
| `disabled` | —          | `boolean`              | Disable the fieldset.                              |
| `invalid`  | —          | `boolean`              | Mark the fieldset invalid.                         |

## Customize with CSS

Load the [package stylesheet](../getting-started.md) first. Classes:
`.leverui-fieldset__root`, `__legend`, `__content`, `__helperText`,
`__errorText`. Root variables: `--lui-fieldset-space-y`,
`--lui-fieldset-content-gap`, `--lui-fieldset-legend-size`.

```css
.account-form {
  --lui-colors-fg-error: #a02fd0;
  --lui-fieldset-content-gap: 1.5rem;
}
```

For a one-off change, use `class` and `style`. `unstyled` turns off the default
styles. The root and the parts pass native HTML attributes and callback refs to
their elements.

## Explorer

Click a part name to highlight it in the preview.
