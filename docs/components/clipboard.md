# Clipboard

Copies text to the clipboard and shows that it was copied.

```tsx
import { Clipboard } from '@leverui/components';
```

```tsx
<Clipboard.Root>
  <Clipboard.Trigger>
    <Clipboard.CopyText />
    <Clipboard.Indicator />
  </Clipboard.Trigger>
  <Clipboard.Input />
</Clipboard.Root>
```

## Props

### Root

| Prop             | Default | Type                  | Description                                         |
| ---------------- | ------- | --------------------- | --------------------------------------------------- |
| `timeout`        | `3000`  | `number`              | Time the copied state lasts, in milliseconds.       |
| `asChild`        | —       | Solid render function | Render your own element with the clipboard's props. |
| `defaultValue`   | —       | `string`              | Initial text to copy.                               |
| `id`             | —       | `string`              | Unique id.                                          |
| `ids`            | —       | Element ID map        | Your own ids for the clipboard's elements.          |
| `onStatusChange` | —       | `(details) => void`   | Called when the value is copied.                    |
| `onValueChange`  | —       | `(details) => void`   | Called when the value changes.                      |
| `translations`   | —       | `IntlTranslations`    | Translated text for screen readers.                 |
| `value`          | —       | `string`              | Text to copy. Controlled.                           |

With a signal as `value`, `Clipboard.Input` and `Clipboard.ValueText` update
with it. Give an icon-only trigger an accessible name, such as an `aria-label`.

## Explorer

Click a part name to highlight it in the preview.
