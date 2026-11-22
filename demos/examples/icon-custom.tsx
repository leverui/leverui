import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Heart, PackageIcon } from '@lucide/solid';
import { HStack, Icon, Text, VStack } from '../../src';
import './icon-examples.css';

/** Size and color an icon component passed as Icon's child. */
export function IconWithAsProp(): JSX.Element {
  return (
    <Icon as="span" size="lg" class="icon-example-pink">
      <Heart />
    </Icon>
  );
}

/** Show all six Icon sizes alongside their labels. */
export function IconWithSizes(): JSX.Element {
  return (
    <HStack gap="8">
      <For each={['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const}>
        {
          /** Render one labelled package icon at a size. */
          (size) => (
            <VStack>
              <Icon as="span" size={size} class="icon-example-muted">
                <PackageIcon />
              </Icon>
              <Text textStyle="sm">{size}</Text>
            </VStack>
          )
        }
      </For>
    </HStack>
  );
}
