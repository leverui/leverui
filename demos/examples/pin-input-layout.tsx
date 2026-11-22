import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Clipboard, Field, Group, IconButton, PinInput, Span, Stack } from '../../src';
import './pin-input-layout.css';

/** Separate six code digits into two attached groups of three. */
export function PinInputWithSeparator(): JSX.Element {
  return (
    <PinInput.Root count={6}>
      <PinInput.HiddenInput />
      <PinInput.Control class="pin-input-separated-control">
        <Group attached>
          <PinInput.Input index={0} />
          <PinInput.Input index={1} />
          <PinInput.Input index={2} />
        </Group>
        <Span class="example-pin-input-separator">–</Span>
        <Group attached>
          <PinInput.Input index={3} />
          <PinInput.Input index={4} />
          <PinInput.Input index={5} />
        </Group>
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** Compare small, medium, and large code fields. */
export function PinInputSizes(): JSX.Element {
  return (
    <Stack gap="4">
      <For each={['sm', 'md', 'lg'] as const}>
        {
          /** Give each CSS size an independent code machine. */
          (size) => (
            <PinInput.Root count={4} size={size}>
              <PinInput.HiddenInput />
              <PinInput.Control>
                <PinInput.Input index={0} />
                <PinInput.Input index={1} />
                <PinInput.Input index={2} />
                <PinInput.Input index={3} />
              </PinInput.Control>
            </PinInput.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Remove separators from a copied code before machine validation. */
function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Show a copyable dashed code and a numeric paste target. */
export function PinInputSanitizedValue(): JSX.Element {
  return (
    <Stack gap="4">
      <Clipboard.Root value="1-2-3-4">
        <Clipboard.ValueText class="example-pin-input-code" />
        <Clipboard.Trigger
          asChild={
            /** Keep copy behavior on the outline icon button. */
            (getProps) => (
              <IconButton {...getProps()} size="xs" variant="outline" aria-label="Copy code">
                <Clipboard.Indicator />
              </IconButton>
            )
          }
        />
      </Clipboard.Root>
      <Field.Root>
        <Field.Label>Paste the copied code</Field.Label>
        <PinInput.Root count={4} normalizeValue={sanitizeDigits}>
          <PinInput.HiddenInput />
          <PinInput.Control>
            <PinInput.Input index={0} />
            <PinInput.Input index={1} />
            <PinInput.Input index={2} />
            <PinInput.Input index={3} />
          </PinInput.Control>
        </PinInput.Root>
        <Field.HelperText>Dashes are removed before validation.</Field.HelperText>
      </Field.Root>
    </Stack>
  );
}
