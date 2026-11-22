# Editable

Text that turns into an input when the user clicks it, so they can change it in
place.

```tsx
import { Editable } from '@leverui/components';
```

```tsx
<Editable.Root>
  <Editable.Preview />
  <Editable.Input />
</Editable.Root>
```

## Guides

### Multiline editing

Use `Textarea` in place of `Input`. It renders a native `textarea`.

### State and validation

`onValueChange`, `onValueCommit`, and `onValueRevert` get the details of the
change. `disabled`, `readOnly`, and `required` pass to the native input or
textarea.

### Caller-owned machine

Call `useEditable` inside a Solid owner, such as a component, and pass the
accessor to `RootProvider`. `Context` gives you the current accessor.

```tsx
import { Editable, useEditable } from '@leverui/components';

export function EditableName() {
  const editable = useEditable({ defaultValue: 'Name' });
  return (
    <Editable.RootProvider value={editable}>
      <Editable.Preview />
      <Editable.Input />
    </Editable.RootProvider>
  );
}
```

## Props

### Root

| Prop                   | Default   | Type                                          | Description                                              |
| ---------------------- | --------- | --------------------------------------------- | -------------------------------------------------------- |
| `activationMode`       | `'focus'` | `'focus' \| 'dblclick' \| 'click' \| 'none'`  | What switches the preview to edit mode.                  |
| `selectOnFocus`        | `true`    | `boolean`                                     | Select the text when the input gets focus.               |
| `submitMode`           | `'both'`  | `'enter' \| 'blur' \| 'none' \| 'both'`       | What saves the value: Enter, blur, both, or neither.     |
| `size`                 | `'md'`    | `'sm' \| 'md' \| 'lg'`                        | Component size.                                          |
| `as`                   | `div`     | Native tag                                    | HTML tag to render.                                      |
| `asChild`              | —         | Solid render function                         | Render your own element with the root's props.           |
| `unstyled`             | —         | `boolean`                                     | Turn off the default styles.                             |
| `autoResize`           | —         | `boolean`                                     | Resize to fit the content.                               |
| `defaultEdit`          | —         | `boolean`                                     | Start in edit mode.                                      |
| `defaultValue`         | —         | `string`                                      | Starting value.                                          |
| `disabled`             | —         | `boolean`                                     | Disable the editable.                                    |
| `edit`                 | —         | `boolean`                                     | Whether edit mode is on.                                 |
| `finalFocusEl`         | —         | `() => HTMLElement \| null`                   | Element focused when editing ends.                       |
| `form`                 | —         | `string`                                      | Form the input belongs to.                               |
| `id`                   | —         | `string`                                      | Unique id.                                               |
| `ids`                  | —         | Element ID map                                | Ids of the elements inside.                              |
| `invalid`              | —         | `boolean`                                     | Mark the value as invalid.                               |
| `maxLength`            | —         | `number`                                      | Most characters accepted.                                |
| `name`                 | —         | `string`                                      | `name` attribute. Sent with the form.                    |
| `onEditChange`         | —         | `(details: EditChangeDetails) => void`        | Called when edit mode turns on or off.                   |
| `onFocusOutside`       | —         | `(event: FocusOutsideEvent) => void`          | Called when focus moves outside.                         |
| `onInteractOutside`    | —         | `(event: InteractOutsideEvent) => void`       | Called on an interaction outside.                        |
| `onPointerDownOutside` | —         | `(event: PointerDownOutsideEvent) => void`    | Called when the pointer is pressed outside.              |
| `onValueChange`        | —         | `(details: ValueChangeDetails) => void`       | Called when the value changes.                           |
| `onValueCommit`        | —         | `(details: ValueChangeDetails) => void`       | Called when the value is saved.                          |
| `onValueRevert`        | —         | `(details: ValueChangeDetails) => void`       | Called when an edit is canceled.                         |
| `placeholder`          | —         | `string \| { edit: string; preview: string }` | Placeholder text. An object sets edit and preview apart. |
| `readOnly`             | —         | `boolean`                                     | Make the editable read-only.                             |
| `required`             | —         | `boolean`                                     | Mark the editable as required.                           |
| `translations`         | —         | `IntlTranslations`                            | Translated text.                                         |
| `value`                | —         | `string`                                      | Current value, when you control it.                      |

## Customize with CSS

Import the Lever UI stylesheet before your own CSS.

Classes: `.leverui-editable__root`, `.leverui-editable__preview`,
`.leverui-editable__input`, `.leverui-editable__textarea`. The textarea also has
the input class.

Attributes: `data-size` on the root, `data-size-*` for sizes set per screen
size, and editing-state attributes on the parts.

Variables: `--leverui-editable-gap`, `--leverui-editable-padding-block`,
`--leverui-editable-padding-inline`, `--leverui-editable-control-height`,
`--leverui-editable-font-size`, `--leverui-editable-focus-color`.

The root and every part accept `unstyled`, `class`, `style`, native HTML
attributes, refs, `as`, and `asChild`. Prop types follow the tag you pick:
`EditablePreviewProps<'a'>` accepts an anchor's `href`.

## Explorer

Click a part name in the sidebar to highlight it in the preview.
