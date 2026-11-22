import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { XIcon } from '@lucide/solid';
import { CloseButton, HStack } from '../../src';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

/** Show the default close action. */
export function CloseButtonBasic(): JSX.Element {
  return <CloseButton />;
}

/** Compare the six outlined close-button sizes. */
export function CloseButtonWithSizes(): JSX.Element {
  return (
    <HStack gap="4" wrap="wrap">
      <For each={sizes}>{(size) => <CloseButton variant="outline" size={size} />}</For>
    </HStack>
  );
}

/** Compare the four close-button variants. */
export function CloseButtonWithVariants(): JSX.Element {
  return (
    <HStack>
      <CloseButton variant="ghost" />
      <CloseButton variant="outline" />
      <CloseButton variant="subtle" />
      <CloseButton variant="solid" />
    </HStack>
  );
}

/** Replace the default close glyph with a custom icon. */
export function CloseButtonWithCustomIcon(): JSX.Element {
  return (
    <CloseButton variant="ghost" aria-label="Close">
      <XIcon />
    </CloseButton>
  );
}
