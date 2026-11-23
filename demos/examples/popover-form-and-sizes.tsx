import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { MessageCircleIcon } from '@lucide/solid';
import {
  Button,
  CloseButton,
  Field,
  Heading,
  Input,
  Popover,
  Portal,
  Stack,
  Text,
  Textarea,
} from '../../src';

const popoverSizes = ['xs', 'sm', 'md', 'lg'] as const;
const matrixCellStyle = { 'padding-right': '32px', 'padding-bottom': '32px' } as const;
const headerCellStyle = {
  ...matrixCellStyle,
  'font-size': '14px',
  'line-height': '21px',
  color: 'var(--lui-colors-fg-muted)',
} as const;

/** Show three labeled inputs inside the Popover form. */
export function PopoverForm(): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger
        asChild={
          /** Forward the trigger props to the styled button. */
          (getProps) => (
            <Button {...getProps()} size="sm" variant="outline">
              Click me
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Width</Field.Label>
                  <Input placeholder="40px" />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Height</Field.Label>
                  <Input placeholder="32px" />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Comments</Field.Label>
                  <Textarea placeholder="Start typing..." />
                </Field.Root>
              </Stack>
            </Popover.Body>
            <Popover.CloseTrigger
              asChild={
                /** Preserve the Popover close action on the icon button. */
                (getProps) => <CloseButton {...getProps()} />
              }
            />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

/** Compare the four Popover sizes from a row of triggers. */
export function PopoverSizes(): JSX.Element {
  return (
    <Stack align="center" direction="row" gap="10">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Give each size its own trigger and panel. */
          (size) => (
            <Popover.Root size={size}>
              <Popover.Trigger
                asChild={
                  /** Match the trigger size to its Popover panel. */
                  (getProps) => (
                    <Button {...getProps()} size={size} variant="outline">
                      Click me
                    </Button>
                  )
                }
              />
              <Portal>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>
                      <Popover.Title style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
                        Lanternwright Notes
                      </Popover.Title>
                      <Text style={{ 'margin-block': 'var(--lui-spacing-4)' }}>
                        The Lanternwright Chronicles is a fantasy novel series about an apprentice
                        lamplighter in a city that rearranges itself every night.
                      </Text>
                      <Input placeholder="Your favorite character" size={size} />
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Show the four Popover sizes open in one matrix for Storybook review. */
export function PopoverSizeMatrix(): JSX.Element {
  return (
    <table style={{ width: '100%', 'margin-bottom': '32px', 'border-collapse': 'collapse' }}>
      <thead>
        <tr>
          <For each={popoverSizes}>{(size) => <td style={headerCellStyle}>{size}</td>}</For>
        </tr>
      </thead>
      <tbody>
        <tr>
          <For each={popoverSizes}>
            {(size) => (
              <td style={{ ...matrixCellStyle, 'min-width': '400px' }}>
                <Popover.Root size={size} open>
                  <Popover.Trigger
                    asChild={
                      /** Match the trigger size to its Popover panel. */
                      (getProps) => (
                        <Button {...getProps()} size={size} variant="solid">
                          <MessageCircleIcon />
                          Add comment
                        </Button>
                      )
                    }
                  />
                  <Portal>
                    <Popover.Positioner>
                      <Popover.Content>
                        <Popover.Arrow />
                        <Popover.CloseTrigger />
                        <Popover.Header>
                          <Heading size="sm">New comment</Heading>
                        </Popover.Header>
                        <Popover.Body>
                          <Textarea size={size} placeholder="Type your comment here" />
                        </Popover.Body>
                        <Popover.Footer style={{ gap: 'var(--lui-spacing-2)' }}>
                          <Button size={size} variant="solid">
                            Submit
                          </Button>
                          <Button size={size}>Cancel</Button>
                        </Popover.Footer>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Portal>
                </Popover.Root>
              </td>
            )}
          </For>
        </tr>
      </tbody>
    </table>
  );
}
