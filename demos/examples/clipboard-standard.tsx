import { type JSX } from '@solidjs/web';
import {
  Button,
  Clipboard,
  IconButton,
  Input,
  InputGroup,
  Link,
  Stack,
  useClipboard,
} from '../../src';
import './clipboard-standard.css';

/** Show the compact icon-only copy action. */
export function ClipboardBasic(): JSX.Element {
  return (
    <Clipboard.Root value="https://leverui.com">
      <Clipboard.Trigger
        asChild={
          /** Keep the copy action on the styled icon button. */
          (getProps) => (
            <IconButton {...getProps()} aria-label="Copy to clipboard" variant="surface" size="xs">
              <Clipboard.Indicator />
            </IconButton>
          )
        }
      />
    </Clipboard.Root>
  );
}

/** Show the Copy and Copied text button. */
export function ClipboardWithButton(): JSX.Element {
  return (
    <Clipboard.Root value="https://leverui.com">
      <Clipboard.Trigger
        asChild={
          /** Place the trigger contract on a surface Button. */
          (getProps) => (
            <Button {...getProps()} variant="surface" size="sm">
              <Clipboard.Indicator />
              <Clipboard.CopyText />
            </Button>
          )
        }
      />
    </Clipboard.Root>
  );
}

/** Reset the copied status after the one-second timeout. */
export function ClipboardWithTimeout(): JSX.Element {
  return (
    <Clipboard.Root value="https://leverui.com" timeout={1000}>
      <Clipboard.Trigger
        asChild={
          /** Place the trigger contract on a surface Button. */
          (getProps) => (
            <Button {...getProps()} variant="surface" size="sm">
              <Clipboard.Indicator />
              <Clipboard.CopyText />
            </Button>
          )
        }
      />
    </Clipboard.Root>
  );
}

/** Pair the read-only document URL with an inset copy button. */
export function ClipboardWithInput(): JSX.Element {
  return (
    <Clipboard.Root class="clipboard-example-input-root" value="https://leverui.com">
      <Clipboard.Label class="clipboard-example-label">Document link</Clipboard.Label>
      <InputGroup
        endElement={
          <Clipboard.Trigger
            asChild={
              /** Keep the copy action on the inset icon button. */
              (getProps) => (
                <IconButton
                  {...getProps()}
                  aria-label="Copy to clipboard"
                  variant="surface"
                  size="xs"
                  class="clipboard-example-inset-trigger"
                >
                  <Clipboard.Indicator />
                </IconButton>
              )
            }
          />
        }
      >
        <Clipboard.Input
          asChild={
            /** Preserve the machine-owned value on a styled Input. */
            (getProps) => <Input {...getProps()} />
          }
        />
      </InputGroup>
    </Clipboard.Root>
  );
}

/** Expose the copied URL inside a blue link-like trigger. */
export function ClipboardWithLink(): JSX.Element {
  return (
    <Clipboard.Root value="https://leverui.com">
      <Clipboard.Trigger
        asChild={
          /** Keep the trigger's keyboard and copy behavior on the span. */
          (getProps) => (
            <Link as="span" {...getProps()} class="clipboard-example-link">
              <Clipboard.Indicator />
              <Clipboard.ValueText />
            </Link>
          )
        }
      />
    </Clipboard.Root>
  );
}

/** Drive a custom copy button from the Clipboard store hook. */
export function ClipboardWithStore(): JSX.Element {
  const clipboard = useClipboard({ value: 'https://leverui.com' });
  return (
    <Button
      variant="surface"
      size="sm"
      onClick={
        /** Copy the example URL. */
        () => clipboard().copy()
      }
    >
      {clipboard().copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

/** Show every public Clipboard part for the guide's anatomy explorer. */
export function ClipboardExplorerDemo(): JSX.Element {
  return (
    <Stack gap="6" style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
      <Clipboard.Root value="https://leverui.com">
        <Clipboard.Label class="clipboard-example-label">Copy link</Clipboard.Label>
        <Stack direction="row" gap="2" align="center">
          <Clipboard.Input
            asChild={
              /** Forward input behavior to the read-only Input. */
              (getProps) => <Input {...getProps()} readonly />
            }
          />
          <Clipboard.Control>
            <Clipboard.Trigger
              asChild={
                /** Forward copy behavior to the outline Button. */
                (getProps) => (
                  <Button {...getProps()} size="sm" variant="outline">
                    Copy
                    <Clipboard.Indicator />
                  </Button>
                )
              }
            />
          </Clipboard.Control>
        </Stack>
        <Clipboard.ValueText />
      </Clipboard.Root>
    </Stack>
  );
}
