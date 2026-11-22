import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileImageIcon, XIcon } from '@lucide/solid';
import { Button, FileUpload, Float, Input, useFileUploadContext } from '../../src';
import './file-upload-examples.css';

/** Render selected image thumbnails with an individual remove action. */
function PreviewList(): JSX.Element {
  const upload = useFileUploadContext();
  return (
    <Show when={upload().acceptedFiles.length > 0}>
      <FileUpload.ItemGroup>
        <For each={upload().acceptedFiles}>
          {
            /** Keep each image bound to the file machine's item context. */
            (file) => (
              <FileUpload.Item file={file} class="example-file-upload-preview">
                <FileUpload.ItemPreviewImage />
                <Float placement="top-end">
                  <FileUpload.ItemDeleteTrigger
                    aria-label={`Remove ${file.name}`}
                    class="example-file-upload-preview-remove"
                  >
                    <XIcon />
                  </FileUpload.ItemDeleteTrigger>
                </Float>
              </FileUpload.Item>
            )
          }
        </For>
      </FileUpload.ItemGroup>
    </Show>
  );
}

/** Preview an uploaded image as a removable square thumbnail. */
export function FileUploadCustomPreview(): JSX.Element {
  return (
    <FileUpload.Root accept="image/*">
      <FileUpload.HiddenInput />
      <FileUpload.Trigger
        asChild={
          /** Forward the picker activation to the styled button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              <FileImageIcon /> Upload images
            </Button>
          )
        }
      />
      <PreviewList />
    </FileUpload.Root>
  );
}

/** Render pasted image thumbnails with a remove action in the top-start corner. */
function PastedImageList(): JSX.Element {
  const upload = useFileUploadContext();
  return (
    <FileUpload.ItemGroup class="example-file-upload-pasted-list">
      <For each={upload().acceptedFiles}>
        {
          /** Keep each pasted image bound to the file machine's item context. */
          (file) => (
            <FileUpload.Item file={file} class="example-file-upload-pasted-item">
              <Float placement="top-start">
                <FileUpload.ItemDeleteTrigger
                  aria-label={`Remove ${file.name}`}
                  class="example-file-upload-pasted-remove"
                >
                  <XIcon />
                </FileUpload.ItemDeleteTrigger>
              </Float>
              <FileUpload.ItemPreviewImage class="example-file-upload-pasted-image" />
            </FileUpload.Item>
          )
        }
      </For>
    </FileUpload.ItemGroup>
  );
}

/** Put the clipboard handler inside the nearest file upload provider. */
function FilePasteInput(): JSX.Element {
  const upload = useFileUploadContext();

  /** Forward pasted files from a real text input. */
  function onPaste(event: ClipboardEvent): void {
    upload().setClipboardFiles(event.clipboardData);
  }

  return <Input placeholder="Paste image here..." onPaste={onPaste} />;
}

/** Paste image clipboard data into the same file upload machine. */
export function FileUploadPasteEvent(): JSX.Element {
  return (
    <FileUpload.Root maxFiles={3} accept="image/*">
      <FileUpload.HiddenInput />
      <PastedImageList />
      <FilePasteInput />
    </FileUpload.Root>
  );
}
