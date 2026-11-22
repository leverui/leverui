import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { InfoIcon } from '@lucide/solid';
import { Button, Flex, FormatByte, HStack, InfoTip, Text, ToggleTip } from '../../src';

/** Show a compact informational Popover from a ghost button. */
export function ToggleTipBasic(): JSX.Element {
  return (
    <ToggleTip content="Changes are saved automatically.">
      {
        /** Forward Popover trigger behavior to the ghost button. */
        (getProps) => (
          <Button {...getProps()} size="xs" variant="ghost" aria-label="info">
            <InfoIcon />
          </Button>
        )
      }
    </ToggleTip>
  );
}

/** Place an information trigger after a formatted byte value. */
export function ToggleTipInfoTip(): JSX.Element {
  return (
    <HStack justify="center">
      <Text textStyle="lg">
        File size: <FormatByte value={1450.45} />
      </Text>
      <InfoTip content="This is the size of content.tsx before compression." />
    </HStack>
  );
}

/** Size the Popover and its information button together. */
export function ToggleTipSizes(): JSX.Element {
  return (
    <HStack gap="8" justify="center">
      <For each={['xs', 'sm', 'md', 'lg'] as const}>
        {
          /** Apply one size to both the tip and its button. */
          (size) => (
            <InfoTip
              size={size}
              buttonProps={{ size }}
              content={`This tip uses the "${size}" size.`}
            />
          )
        }
      </For>
    </HStack>
  );
}

/** Add the small arrow tip to the informational Popover. */
export function ToggleTipArrow(): JSX.Element {
  return (
    <Flex justify="center">
      <InfoTip showArrow content="Changes are saved automatically." />
    </Flex>
  );
}
