# Format Number

Shows a number formatted for the reader's language, such as a price, a percent,
or a compact count.

```tsx
import { FormatNumber } from '@leverui/components';
```

```tsx
<FormatNumber value={1000} />
```

## Guides

### Output

Renders plain text with no element around it, in the locale of the nearest
`LocaleProvider`. For attributes, styles, or a test selector, wrap it in an
element such as `span`.

For a percentage, set `style="percent"` and pass a fraction, such as `0.25` for
25%. The value, the options, and the provider's locale can all change at
runtime.

For bytes, see [Format Byte](format-byte.md).

## Props

| Prop    | Default  | Type     | Description       |
| ------- | -------- | -------- | ----------------- |
| `value` | Required | `number` | Number to format. |

Also accepts every `Intl.NumberFormat` option.
