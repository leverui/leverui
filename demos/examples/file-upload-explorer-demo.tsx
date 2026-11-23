import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { UploadIcon, XIcon } from '@lucide/solid';
import { Button, FileUpload, Float, HStack, Text, VStack } from '../../src';

/** Build a small coloured SVG so the preview image part has content to show. */
function createFile(name: string, color: string): File {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="${color}" /></svg>`;
  return new File([new Blob([svg], { type: 'image/svg+xml' })], name, { type: 'image/svg+xml' });
}

const mutedText = { color: 'var(--lui-colors-fg-muted)' };

/** Render every File Upload part so the anatomy explorer can highlight each one. */
export function FileUploadExplorerDemo(): JSX.Element {
  return (
    <VStack
      gap="8"
      style={{
        padding: 'var(--lui-spacing-8)',
        'max-width': '600px',
        'margin-inline': 'auto',
        'align-items': 'stretch',
      }}
    >
      <FileUpload.Root
        accept="image/*"
        maxFiles={3}
        defaultAcceptedFiles={[createFile('wren_ashford.svg', '#f97316')]}
      >
        <FileUpload.Label>Upload up to three images</FileUpload.Label>
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone style={{ width: '100%' }}>
          <FileUpload.DropzoneContent style={{ width: '100%' }}>
            <VStack gap="4" style={{ padding: 'var(--lui-spacing-8)' }}>
              <UploadIcon style={{ 'font-size': '36px' }} />
              <Text style={{ ...mutedText, 'font-size': 'var(--lui-font-sizes-sm)' }}>
                Drag and drop files here
              </Text>
              <FileUpload.Trigger
                asChild={
                  /** Forward the picker activation to the styled button. */
                  (getProps) => (
                    <Button {...getProps()} size="sm">
                      Browse files
                    </Button>
                  )
                }
              />
              <FileUpload.FileText style={mutedText} />
            </VStack>
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
        <FileUpload.ClearTrigger
          asChild={
            /** Remove every accepted file through the machine's clear action. */
            (getProps) => (
              <Button {...getProps()} size="xs" variant="ghost">
                Clear all
              </Button>
            )
          }
        />
        <FileUpload.ItemGroup style={{ gap: 'var(--lui-spacing-3)' }}>
          <FileUpload.Context>
            {
              /** Follow the machine's accepted files through the part context. */
              (context) => (
                <For each={context().acceptedFiles}>
                  {
                    /** Bind one accepted file to its item parts. */
                    (file) => (
                      <FileUpload.Item file={file} style={{ width: '100%' }}>
                        <HStack
                          gap="3"
                          style={{
                            padding: 'var(--lui-spacing-3)',
                            'border-width': '1px',
                            'border-radius': 'var(--lui-radii-md)',
                            width: '100%',
                          }}
                        >
                          <FileUpload.ItemPreview>
                            <FileUpload.ItemPreviewImage
                              style={{
                                width: 'var(--lui-sizes-16)',
                                height: 'var(--lui-sizes-16)',
                                'border-radius': 'var(--lui-radii-md)',
                              }}
                            />
                          </FileUpload.ItemPreview>
                          <FileUpload.ItemContent style={{ flex: '1' }}>
                            <FileUpload.ItemName />
                            <FileUpload.ItemSizeText style={mutedText} />
                          </FileUpload.ItemContent>
                          <Float placement="top-end">
                            <FileUpload.ItemDeleteTrigger aria-label={`Remove ${file.name}`}>
                              <XIcon />
                            </FileUpload.ItemDeleteTrigger>
                          </Float>
                        </HStack>
                      </FileUpload.Item>
                    )
                  }
                </For>
              )
            }
          </FileUpload.Context>
        </FileUpload.ItemGroup>
      </FileUpload.Root>
    </VStack>
  );
}
