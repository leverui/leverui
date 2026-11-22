import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CheckIcon, CircleUserIcon, FileBadgeIcon } from '@lucide/solid';
import { HStack, Stack, Tag } from '../../src';

/** Add icons at the start or end of a tag. */
export function TagWithIcon(): JSX.Element {
  return (
    <HStack>
      <Tag.Root>
        <Tag.StartElement>
          <CircleUserIcon />
        </Tag.StartElement>
        <Tag.Label>Member</Tag.Label>
      </Tag.Root>
      <Tag.Root>
        <Tag.StartElement>
          <FileBadgeIcon />
        </Tag.StartElement>
        <Tag.Label>Top rated</Tag.Label>
      </Tag.Root>
      <Tag.Root>
        <Tag.Label>Guest</Tag.Label>
        <Tag.EndElement>
          <CircleUserIcon />
        </Tag.EndElement>
      </Tag.Root>
    </HStack>
  );
}

/** Stack one row of tags for each visual treatment. */
export function TagWithVariants(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['subtle', 'solid', 'outline', 'surface'] as const}>
        {
          /** Render the three tag forms in the selected treatment. */
          (variant) => (
            <HStack>
              <Tag.Root variant={variant}>
                <Tag.Label>Gray</Tag.Label>
              </Tag.Root>
              <Tag.Root variant={variant}>
                <Tag.Label>Gray</Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger />
                </Tag.EndElement>
              </Tag.Root>
              <Tag.Root variant={variant}>
                <Tag.Label>Gray</Tag.Label>
                <Tag.EndElement>
                  <CheckIcon />
                </Tag.EndElement>
              </Tag.Root>
            </HStack>
          )
        }
      </For>
    </Stack>
  );
}

/** Stack one row of tags for each size. */
export function TagWithSizes(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['sm', 'md', 'lg'] as const}>
        {
          /** Render the three tag forms at the selected size. */
          (size) => (
            <HStack>
              <Tag.Root size={size}>
                <Tag.Label>Gray</Tag.Label>
              </Tag.Root>
              <Tag.Root size={size}>
                <Tag.Label>Gray</Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger />
                </Tag.EndElement>
              </Tag.Root>
              <Tag.Root size={size}>
                <Tag.Label>Gray</Tag.Label>
                <Tag.EndElement>
                  <CheckIcon />
                </Tag.EndElement>
              </Tag.Root>
            </HStack>
          )
        }
      </For>
    </Stack>
  );
}

/** Apply Tag styling to a native submit button. */
export function TagAsButton(): JSX.Element {
  return (
    <Tag.Root
      variant="solid"
      asChild={
        /** Merge Tag presentation and events onto the button. */
        (getProps) => <button {...getProps()} type="submit" />
      }
    >
      <Tag.Label>Fish </Tag.Label>
      <CheckIcon />
    </Tag.Root>
  );
}

/** Render every Tag anatomy part for the guide Explorer. */
export function TagExplorerDemo(): JSX.Element {
  return (
    <Tag.Root>
      <Tag.StartElement>
        <CircleUserIcon />
      </Tag.StartElement>
      <Tag.Label>Closable tag</Tag.Label>
      <Tag.EndElement>
        <Tag.CloseTrigger />
      </Tag.EndElement>
    </Tag.Root>
  );
}
