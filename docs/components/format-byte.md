# Format Byte

Shows a number of bytes in a readable unit, such as `1.5 MB`.

```tsx
import { FormatByte } from '@leverui/components';
```

```tsx
<FormatByte value={1000} />
```

## Guides

### Output

`FormatByte` renders plain text with no element around it, in the locale of the
nearest `LocaleProvider`. For attributes, styles, or a test selector, wrap it in
an HTML element such as `span`.

### Bits and bytes

`value` is an amount in the unit you chose. `unit="bit"` changes the label but
does not convert the number. To show 1000 bytes as bits, pass
`value={8000} unit="bit"`.

Default: steps of 1000 and a short label. For steps of 1024, set
`unitSystem="binary"`. Zero shows as `0 B`. `NaN` shows nothing.

See the [formatting guide](format-number.md) for reactive values and changing
the locale.

## Props

| Prop          | Default     | Type                            | Description                                |
| ------------- | ----------- | ------------------------------- | ------------------------------------------ |
| `value`       | Required    | `number`                        | Size to format, in the unit set by `unit`. |
| `unit`        | `'byte'`    | `'bit' \| 'byte'`               | Show the size in bits or bytes.            |
| `unitDisplay` | `'short'`   | `'short' \| 'long' \| 'narrow'` | Unit label style: short, long, or narrow.  |
| `unitSystem`  | `'decimal'` | `'decimal' \| 'binary'`         | Steps of 1000 (decimal) or 1024 (binary).  |
