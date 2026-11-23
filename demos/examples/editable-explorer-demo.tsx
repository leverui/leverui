import { type JSX } from '@solidjs/web';
import { CheckIcon, PencilLineIcon, XIcon } from '@lucide/solid';
import { Editable, HStack, IconButton, Text, VStack } from '../../src';

/** Show every Editable part in edit mode for the guide Explorer. */
export function EditableExplorerDemo(): JSX.Element {
  return (
    <VStack
      align="stretch"
      style={{
        padding: 'var(--lui-spacing-6)',
        'max-width': '600px',
        'margin-inline': 'auto',
        gap: 'var(--lui-spacing-6)',
      }}
    >
      <Editable.Root defaultValue="Click to edit" defaultEdit>
        <VStack align="stretch" style={{ gap: 'var(--lui-spacing-3)' }}>
          <Editable.Label>
            <Text
              style={{
                'font-size': 'var(--lui-font-sizes-sm)',
                color: 'var(--lui-colors-fg-muted)',
              }}
            >
              Project name
            </Text>
          </Editable.Label>
          <Editable.Area>
            <Editable.Preview style={{ padding: 'var(--lui-spacing-2)', 'min-height': '40px' }} />
            <Editable.Input
              style={{
                padding: 'var(--lui-spacing-2)',
                'margin-top': 'var(--lui-spacing-1)',
              }}
            />
          </Editable.Area>
          <Editable.Textarea
            placeholder="Add a longer note"
            style={{
              'min-height': '80px',
              border: '1px solid var(--lui-colors-fg-muted)',
              padding: 'var(--lui-spacing-2)',
            }}
          />
          <Editable.Control>
            <HStack justify="flex-end" style={{ gap: 'var(--lui-spacing-2)' }}>
              <Editable.EditTrigger
                asChild={
                  /** Preserve edit semantics on the icon button. */
                  (getProps) => (
                    <IconButton {...getProps()} size="sm" aria-label="Edit">
                      <PencilLineIcon />
                    </IconButton>
                  )
                }
              />
              <Editable.CancelTrigger
                asChild={
                  /** Preserve cancel semantics on the icon button. */
                  (getProps) => (
                    <IconButton {...getProps()} size="sm" aria-label="Cancel">
                      <XIcon />
                    </IconButton>
                  )
                }
              />
              <Editable.SubmitTrigger
                asChild={
                  /** Preserve submit semantics on the icon button. */
                  (getProps) => (
                    <IconButton {...getProps()} size="sm" aria-label="Submit">
                      <CheckIcon />
                    </IconButton>
                  )
                }
              />
            </HStack>
          </Editable.Control>
        </VStack>
      </Editable.Root>
    </VStack>
  );
}
