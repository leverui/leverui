import { type JSX } from '@solidjs/web';
import { Em, Text } from '../../src';

/** Emphasize a phrase inside running text. */
export function EmBasic(): JSX.Element {
  return (
    <Text>
      We are open <Em>every day</Em> except public holidays
    </Text>
  );
}
