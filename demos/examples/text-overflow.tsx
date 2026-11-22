import { type JSX } from '@solidjs/web';
import { Flex, Text } from '../../src';

/** Constrain the sentence to one truncated line. */
export function TextWithTruncate(): JSX.Element {
  return (
    <Flex style={{ 'max-width': '300px' }}>
      <Text truncate>Your order has shipped and should arrive by Friday afternoon.</Text>
    </Flex>
  );
}

/** Keep the paragraph within two visible lines. */
export function TextWithLineClamp(): JSX.Element {
  return (
    <Flex style={{ 'max-width': '300px' }}>
      <Text lineClamp="2">
        Your order has shipped and should arrive by Friday afternoon. The courier will text you a
        one-hour delivery window that morning. If nobody is home, the parcel goes to the nearest
        pickup point and waits there for seven days.
      </Text>
    </Flex>
  );
}
