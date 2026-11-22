import { type JSX } from '@solidjs/web';
import { Flex, InfoTip } from '../../src';

/** Keep the informational Popover open when Escape is pressed. */
export function ToggleTipCloseOnEscape(): JSX.Element {
  return (
    <Flex justify="center">
      <InfoTip closeOnEscape={false} content="This tip stays open when you press Escape." />
    </Flex>
  );
}

/** Keep the informational Popover open after outside interaction. */
export function ToggleTipCloseOnInteractOutside(): JSX.Element {
  return (
    <Flex justify="center">
      <InfoTip
        closeOnInteractOutside={false}
        content="This tip stays open when you click outside it."
      />
    </Flex>
  );
}
