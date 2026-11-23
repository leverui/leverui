# QR Code

Draws a QR code for a link or other text.

```tsx
import { QrCode } from '@leverui/components';
```

```tsx
<QrCode.Root value="...">
  <QrCode.Frame>
    <QrCode.Pattern />
  </QrCode.Frame>
</QrCode.Root>
```

For one component instead of parts, see the
[snippet below](#closed-component).

## Closed Component

```tsx
import { Show, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { QrCode, type QrCodeRootProps } from '@leverui/components';

export type ClosedQrCodeProps = QrCodeRootProps & {
  fill?: string | undefined;
  overlay?: JSX.Element;
};

export function ClosedQrCode(props: ClosedQrCodeProps) {
  const root = omit(props, 'children', 'fill', 'overlay');
  return (
    <QrCode.Root {...root}>
      <QrCode.Frame style={props.fill ? { fill: props.fill } : {}}>
        <QrCode.Pattern />
      </QrCode.Frame>
      {props.overlay}
      <Show when={props.children}>
        <QrCode.Overlay>{props.children}</QrCode.Overlay>
      </Show>
    </QrCode.Root>
  );
}
```

## Guides

### Generated pattern

`QrCode.Frame` draws the pattern when it has no children. Add `QrCode.Pattern`
yourself to put other SVG children next to it.

Give the frame an `aria-label` when the code carries information the nearby
text does not. When an overlay covers more of the pattern, raise `encoding.ecc`
to `M`, `Q`, or `H`.

### External machine

`useQrCode` creates the state machine outside the component and returns an
accessor. Pass it to `QrCode.RootProvider`. Call `qrCode().setValue(nextValue)`
to change the value. The hook is also `QrCode.useQrCode`. `QrCode.Context` and
`useQrCodeContext()` read the nearest machine from inside a QR code.
`QrCode.PropsProvider` sets default props. They stay reactive.

## Props

### Root

| Prop            | Default | Type                                                               | Description                                    |
| --------------- | ------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| `size`          | `md`    | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | QR code size. Responsive.                      |
| `as`            | `div`   | Native HTML tag                                                    | HTML tag to render.                            |
| `asChild`       | —       | Solid render function                                              | Render your own element with the root's props. |
| `unstyled`      | `false` | `boolean`                                                          | Turn off the Lever UI styles.                  |
| `defaultValue`  | —       | `string`                                                           | Initial value to encode. Uncontrolled.         |
| `encoding`      | —       | `QrCodeGenerateOptions`                                            | Encoding options.                              |
| `id`            | —       | `string`                                                           | Unique id of the state machine.                |
| `ids`           | —       | Element ID map                                                     | Your own ids for the elements.                 |
| `onValueChange` | —       | `(details) => void`                                                | Called when the value changes.                 |
| `pixelSize`     | —       | `number`                                                           | Pixel size of the QR code.                     |
| `value`         | —       | `string`                                                           | Controlled value to encode.                    |

### DownloadTrigger

| Prop                  | Default | Type                  | Description                                       |
| --------------------- | ------- | --------------------- | ------------------------------------------------- |
| `fileName` (required) | —       | `string`              | Name of the downloaded file.                      |
| `mimeType` (required) | —       | `DataUrlType`         | MIME type of the downloaded image.                |
| `asChild`             | —       | Solid render function | Render your own element with the trigger's props. |
| `quality`             | —       | `number`              | Quality of the downloaded image.                  |

## Customize with CSS

Import `@leverui/components/styles.css` before your own stylesheet. Classes:
`.lui-qr-code__*`. Set `--lui-qr-code-size` or
`--lui-qr-code-overlay-size` on a root to resize the code or its overlay.
Restyle a part with your own class. The SVG `fill` takes a CSS color or a
`--lui-*` color variable.

`unstyled` turns off the default styles of the root, frame, and overlay. The
Pattern and DownloadTrigger have classes but no default styles.

## Explorer

Click a part name to highlight it in the preview.
