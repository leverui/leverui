import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PlusIcon } from '@lucide/solid';
import { Box, Checkbox, Link, Stack, Text } from '../../src';
import { colorPalettes } from './playground-matrix';

const colorVariants = ['outline', 'subtle', 'solid'] as const;

/** Compare three variants in each color palette. */
export function CheckboxWithColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {
          /** Render a color label and its three variant stacks. */
          (palette) => (
            <Stack align="center" direction="row" gap="10" class="checkbox-example-palette-row">
              <Text class="checkbox-example-palette-label">{palette}</Text>
              <For each={colorVariants}>
                {
                  /** Compare unchecked and checked values for one variant. */
                  (variant) => (
                    <Stack class="checkbox-example-palette-variant">
                      <Checkbox.Root colorPalette={palette} variant={variant}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Checkbox</Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root colorPalette={palette} variant={variant} defaultChecked>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>Checkbox</Checkbox.Label>
                      </Checkbox.Root>
                    </Stack>
                  )
                }
              </For>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}

/** Replace the default checkmark with the plus icon. */
export function CheckboxWithCustomIcon(): JSX.Element {
  return (
    <Checkbox.Root defaultChecked>
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <PlusIcon />
      </Checkbox.Control>
      <Checkbox.Label>With custom icon</Checkbox.Label>
    </Checkbox.Root>
  );
}

/** Place supporting terms copy under the checkbox label. */
export function CheckboxWithDescription(): JSX.Element {
  return (
    <Checkbox.Root class="checkbox-example-description">
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Stack gap="1">
        <Checkbox.Label>I agree to the terms and conditions</Checkbox.Label>
        <Box textStyle="sm" class="checkbox-example-description-copy">
          By checking this box, you agree to our Terms and Privacy Policy.
        </Box>
      </Stack>
    </Checkbox.Root>
  );
}

/** Keep the terms link inside the checkbox label. */
export function CheckboxWithLink(): JSX.Element {
  return (
    <Checkbox.Root>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>
        I agree to the{' '}
        <Link colorPalette="teal" href="https://google.com">
          terms and conditions
        </Link>
      </Checkbox.Label>
    </Checkbox.Root>
  );
}
