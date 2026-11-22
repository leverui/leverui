# Download Trigger

A button that saves data, such as an image or a text file, to the user's device.

```tsx
import { DownloadTrigger } from '@leverui/components';
```

```tsx
<DownloadTrigger data="..." fileName="x.png" mimeType="image/png" />
```

## Guides

### Styled child

Use `asChild` to render a `Button` as the trigger. Pass your handlers to
`getProps` so they run before the trigger's. An `onClick` added after
`{...getProps()}` replaces the trigger's handler.

```tsx
import { createSignal } from 'solid-js';
import { Button, DownloadTrigger } from '@leverui/components';

export function StyledDownload() {
  const [requested, setRequested] = createSignal(false);

  function handleChildClick() {
    setRequested(true);
  }

  return (
    <>
      <DownloadTrigger
        data="Hello"
        fileName="hello.txt"
        mimeType="text/plain"
        asChild={(getProps) => (
          <Button {...getProps({ onClick: handleChildClick })} variant="outline">
            Download
          </Button>
        )}
      />
      <output>{requested() ? 'Download requested' : 'Ready'}</output>
    </>
  );
}
```

### Behavior

Default `type="button"`, so it does not submit a form. `onClick` runs first.
Call `event.preventDefault()` there to cancel the download. `data`, `fileName`,
and `mimeType` are read on click, so signals can change them.

To download from elsewhere, call `useDownload` with
`{ data, fileName, mimeType }` and attach its `download` function to a button.

## Props

| Prop       | Default    | Type                                   | Description                                                                                  |
| ---------- | ---------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `data`     | —          | `DownloadableData \| (() => Promise…)` | String, `Blob`, or `File`, or a function returning one or a promise of one. Called on click. |
| `fileName` | —          | `string`                               | Saved file name.                                                                             |
| `mimeType` | —          | `FileMimeType`                         | Saved file MIME type.                                                                        |
| `type`     | `'button'` | `string`                               | Button `type` attribute.                                                                     |
| `disabled` | —          | `boolean`                              | Stop the trigger from starting a download.                                                   |
| `as`       | `button`   | Native tag name                        | HTML tag to render.                                                                          |
| `asChild`  | —          | Solid render function                  | Render your own element with the trigger's props.                                            |

No styles of its own. Render a `Button` as its child for sizes, variants,
loading state, and color palettes.

## Customize with CSS

Set `class` or `style` on the trigger, or target `.leverui-download-trigger`.
Import `@leverui/components/styles.css` when you use it with styled components
such as `Button`.
