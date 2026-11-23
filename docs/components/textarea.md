# Textarea

A text field for several lines of text.

```tsx
import { Textarea } from '@leverui/components';
```

```tsx
<Textarea placeholder="..." />
```

## Ref

```tsx
import { Textarea } from '@leverui/components';

export function Demo() {
  let ref: HTMLTextAreaElement | undefined;

  return <Textarea ref={ref} />;
}
```

## Guides

### Native control

Inside a `Field.Root`, `Textarea` gets the field's label, description,
validation state, and native required, disabled, and read-only attributes.
Outside a field, it works like a plain `<textarea>`.

### Responsive sizes and variants

`size` and `variant` each take a single value, a breakpoint object, or an array
in breakpoint order. Responsive values set `data-size-sm` through
`data-size-2xl`, and matching attributes for the variant.

```tsx
<Textarea
  aria-label="Responsive notes"
  size={{ base: 'sm', md: 'lg' }}
  variant={{ base: 'outline', md: 'flushed' }}
/>
```

`TextareaPropsProvider` sets default props for the textareas inside it. The
defaults are reactive. A prop on a textarea wins.

### Field composition

```tsx
import { Field, Textarea } from '@leverui/components';

<Field.Root id="notes" required>
  <Field.Label>Notes</Field.Label>
  <Textarea />
  <Field.HelperText>Give us the details.</Field.HelperText>
  <Field.ErrorText>Notes are required.</Field.ErrorText>
</Field.Root>;
```

`invalid`, `disabled`, or `readOnly` on `Field.Root` updates both the native
text box and the state screen readers announce. A textarea on its own also
takes the native `required`, `disabled`, and `readOnly` props.
`data-field-textarea` and the state attributes work in your CSS selectors.

### Values in Solid

`defaultValue` sets the starting text of an uncontrolled textarea. On the
server, it renders as the text inside the `<textarea>`. To control the text,
read `value` from a signal and update it in `onInput`.

A native form reset restores `defaultValue` on an uncontrolled textarea. A
controlled textarea keeps following its signal.

```tsx
import { createSignal } from 'solid-js';
import { Textarea } from '@leverui/components';

function Notes() {
  const [notes, setNotes] = createSignal('');

  function updateNotes(event: InputEvent & { currentTarget: HTMLTextAreaElement }) {
    setNotes(event.currentTarget.value);
  }

  return <Textarea aria-label="Notes" value={notes()} onInput={updateNotes} />;
}
```

### Autoresize behavior

`autoresize` makes the textarea grow with its content. It watches the typed
text, the value, the rows, the placeholder, and the container. Turned off, the
textarea goes back to its native height and can be resized by hand.

## Props

| Prop           | Default    | Type                                                     | Description                                        |
| -------------- | ---------- | -------------------------------------------------------- | -------------------------------------------------- |
| `colorPalette` | `gray`     | `string`                                                 | Color palette for the focus color.                 |
| `size`         | `md`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` or responsive map | Textarea size.                                     |
| `variant`      | `outline`  | `'outline' \| 'subtle' \| 'flushed'` or responsive map   | Textarea style.                                    |
| `autoresize`   | `false`    | `boolean`                                                | Grow taller as the content changes.                |
| `as`           | `textarea` | Native HTML tag                                          | HTML tag to render.                                |
| `asChild`      | —          | Solid render function                                    | Render your own element with the textarea's props. |
| `unstyled`     | `false`    | `boolean`                                                | Turn off the default styles.                       |

Also takes native textarea attributes, event handlers, refs, `class`, and
`style`.

## Customize with CSS

Import your own CSS after `styles.css`. Override a public token, or style the
stable `.lui-textarea` class. The defaults sit in a CSS layer, so normal
CSS overrides them. `data-size`, `data-variant`, and
`data-lui-color-palette` also work in selectors.

```css
.feedback-form .lui-textarea {
  border-radius: 0.75rem;
}

.feedback-form .lui-textarea[data-invalid] {
  border-color: var(--lui-colors-border-error);
}
```

No general style props, `css` objects, or custom recipes.
