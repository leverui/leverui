# File Upload

Lets the user pick files, or drop them onto an area, and lists the files chosen.

```tsx
import { FileUpload } from '@leverui/components';
```

```tsx
<FileUpload.Root>
  <FileUpload.HiddenInput />
  <FileUpload.Label />
  <FileUpload.Dropzone>
    <FileUpload.DropzoneContent />
  </FileUpload.Dropzone>
  <FileUpload.Trigger />
  <FileUpload.ItemGroup>
    <FileUpload.Item>
      <FileUpload.ItemPreview />
      <FileUpload.ItemName />
      <FileUpload.ItemSizeText />
      <FileUpload.ItemDeleteTrigger />
    </FileUpload.Item>
  </FileUpload.ItemGroup>
</FileUpload.Root>
```

## Shortcuts

### FileUploadItems

Renders one item for each uploaded file. Without it:

```tsx
<FileUpload.ItemGroup>
  <FileUpload.Context>
    {(context) => (
      <For each={context().acceptedFiles}>
        {(file) => (
          <FileUpload.Item file={file}>
            <FileUpload.ItemPreview />
            <FileUpload.ItemName />
            <FileUpload.ItemSizeText />
            <FileUpload.ItemDeleteTrigger />
          </FileUpload.Item>
        )}
      </For>
    )}
  </FileUpload.Context>
</FileUpload.ItemGroup>
```

With it, when the items need no changes:

```tsx
<FileUpload.ItemGroup>
  <FileUpload.Items />
</FileUpload.ItemGroup>
```

### FileUploadList

Renders `FileUpload.Items` inside `FileUpload.ItemGroup`.

```tsx
<FileUpload.List />
```

Same as:

```tsx
<FileUpload.ItemGroup>
  <FileUpload.Items />
</FileUpload.ItemGroup>
```

## Guides

Keep `FileUpload.HiddenInput` in every upload. It opens the file picker and
sends the files when a native form is submitted.

To control the upload, call `useFileUpload` inside a Solid owner, such as a
component, and pass the accessor to `RootProvider`. The child function of
`Context` receives the same accessor. Read `context().acceptedFiles` in a
tracked place, such as JSX or an effect.

With `as` or `asChild`, a callback ref receives a plain `Element`. To type a
part's props on their own, pass the tag: `FileUploadDropzoneProps<'a'>` gives
anchor props, including `href`.

## Props

### Root

| Prop                   | Default    | Type                                                                | Description                                        |
| ---------------------- | ---------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| `allowDrop`            | `true`     | `boolean`                                                           | Allow drag and drop onto the dropzone.             |
| `locale`               | `'en-US'`  | `string`                                                            | Locale, as a BCP 47 language tag.                  |
| `maxFiles`             | `1`        | `number`                                                            | Most files allowed.                                |
| `maxFileSize`          | `Infinity` | `number`                                                            | Largest file size, in bytes.                       |
| `preventDocumentDrop`  | `true`     | `boolean`                                                           | Block the drop event on the document.              |
| `as`                   | `div`      | Native tag name                                                     | HTML tag to render.                                |
| `asChild`              | —          | Solid render function                                               | Render your own element with the root's props.     |
| `unstyled`             | —          | `boolean`                                                           | Turn off the Lever UI styles.                      |
| `accept`               | —          | `Record<string, string[]> \| FileMimeType \| FileMimeType[]`        | Allowed file types.                                |
| `acceptedFiles`        | —          | `File[]`                                                            | Accepted files, when controlled.                   |
| `capture`              | —          | `'user' \| 'environment'`                                           | Default camera for a photo or video.               |
| `defaultAcceptedFiles` | —          | `File[]`                                                            | Accepted files on first render, when uncontrolled. |
| `directory`            | —          | `boolean`                                                           | Allow choosing folders. WebKit browsers only.      |
| `disabled`             | —          | `boolean`                                                           | Disable the file input.                            |
| `ids`                  | —          | Element ID map                                                      | Ids for the parts.                                 |
| `invalid`              | —          | `boolean`                                                           | Mark the file input invalid.                       |
| `minFileSize`          | `0`        | `number`                                                            | Smallest file size, in bytes.                      |
| `name`                 | —          | `string`                                                            | `name` of the hidden file input.                   |
| `onFileAccept`         | —          | `(details: FileAcceptDetails) => void`                              | Called when a file is accepted.                    |
| `onFileChange`         | —          | `(details: FileChangeDetails) => void`                              | Called when files change, accepted or rejected.    |
| `onFileReject`         | —          | `(details: FileRejectDetails) => void`                              | Called when a file is rejected.                    |
| `readOnly`             | —          | `boolean`                                                           | Make the file input read-only.                     |
| `required`             | —          | `boolean`                                                           | Make the file input required.                      |
| `transformFiles`       | —          | `(files: File[]) => Promise<File[]>`                                | Transform the accepted files.                      |
| `translations`         | —          | `IntlTranslations`                                                  | Translated messages.                               |
| `validate`             | —          | `(file: File, details: FileValidateDetails) => FileError[] \| null` | Check a file and return any errors.                |

## Customize with CSS

Load the [package stylesheet](../getting-started.md) first, then your CSS.
Every part has a `.leverui-file-upload__*` class, including the hidden input.

```css
.my-upload {
  --leverui-colors-bg: #eef4ff;
  --leverui-colors-fg-muted: #435276;
}

.my-upload .leverui-file-upload__dropzone {
  border-color: #5573a5;
}
```

For one-off changes, use `class` and `style`. Set `unstyled` on the root or a
single part to turn off its default styles.

## Explorer

Click a part name to highlight it in the preview.
