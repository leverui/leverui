import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, Box, Button, CheckboxCard, HStack, Stack, Text } from '../../src';
import './checkbox-card-layout.css';

/** Show the minimal selectable card. */
export function CheckboxCardBasic(): JSX.Element {
  return (
    <CheckboxCard.Root class="example-checkbox-card-sample">
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Label>Next.js</CheckboxCard.Label>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}

/** Add explanatory text beneath the card label. */
export function CheckboxCardWithDescription(): JSX.Element {
  return (
    <CheckboxCard.Root class="example-checkbox-card-sample">
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Content>
          <CheckboxCard.Label>Next.js</CheckboxCard.Label>
          <CheckboxCard.Description>For full-stack apps</CheckboxCard.Description>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}

/** Attach a supporting message and a solid badge below the card. */
export function CheckboxCardWithAddon(): JSX.Element {
  return (
    <CheckboxCard.Root style={{ 'max-width': '300px' }}>
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Content>
          <CheckboxCard.Label>Team plan</CheckboxCard.Label>
          <CheckboxCard.Description>For up to 10 people</CheckboxCard.Description>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
      <CheckboxCard.Addon>
        <HStack>
          Shared folders included
          <Badge variant="solid">New</Badge>
        </HStack>
      </CheckboxCard.Addon>
    </CheckboxCard.Root>
  );
}

/** Show two cards whose selected state has no visual indicator. */
export function CheckboxCardNoIndicator(): JSX.Element {
  return (
    <HStack>
      <CheckboxCard.Root>
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control>
          <CheckboxCard.Label>Lever UI</CheckboxCard.Label>
        </CheckboxCard.Control>
      </CheckboxCard.Root>
      <CheckboxCard.Root>
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control>
          <CheckboxCard.Label>Next.js</CheckboxCard.Label>
        </CheckboxCard.Control>
      </CheckboxCard.Root>
    </HStack>
  );
}

/** Compare the three Checkbox Card sizes. */
export function CheckboxCardWithSizes(): JSX.Element {
  return (
    <Stack class="example-checkbox-card-stack">
      <For each={['sm', 'md', 'lg'] as const}>
        {
          /** Render one labeled card at each size. */
          (size) => (
            <CheckboxCard.Root size={size}>
              <CheckboxCard.HiddenInput />
              <CheckboxCard.Control>
                <CheckboxCard.Content>
                  <CheckboxCard.Label>Checkbox {size}</CheckboxCard.Label>
                </CheckboxCard.Content>
                <CheckboxCard.Indicator />
              </CheckboxCard.Control>
            </CheckboxCard.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare three checked Checkbox Card variants. */
export function CheckboxCardWithVariants(): JSX.Element {
  return (
    <Stack class="example-checkbox-card-stack">
      <For each={['subtle', 'surface', 'outline'] as const}>
        {
          /** Render one checked card in each variant. */
          (variant) => (
            <CheckboxCard.Root defaultChecked variant={variant} colorPalette="teal">
              <CheckboxCard.HiddenInput />
              <CheckboxCard.Control>
                <CheckboxCard.Label>Checkbox {variant}</CheckboxCard.Label>
                <CheckboxCard.Indicator />
              </CheckboxCard.Control>
            </CheckboxCard.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Show every public Checkbox Card part for the guide's anatomy explorer. */
export function CheckboxCardExplorerDemo(): JSX.Element {
  return (
    <CheckboxCard.Root defaultChecked style={{ 'max-width': '280px' }}>
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Addon>
          <Badge variant="solid">N</Badge>
        </CheckboxCard.Addon>
        <Box style={{ flex: '1' }}>
          <CheckboxCard.Label>Next.js</CheckboxCard.Label>
          <CheckboxCard.Description>A framework for full-stack apps.</CheckboxCard.Description>
        </Box>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
      <CheckboxCard.Content>
        <Text style={{ 'font-size': 'var(--lui-font-sizes-sm)' }}>
          It renders pages on the server and lets you add API routes in the same project.
        </Text>
        <Button size="sm" variant="outline">
          Learn more
        </Button>
      </CheckboxCard.Content>
    </CheckboxCard.Root>
  );
}
