import { type JSX } from '@solidjs/web';
import { Flex, useBreakpointValue } from '../../src';

/** Show whether the current viewport has crossed the large breakpoint. */
export function UseBreakpointValueBasic(): JSX.Element {
  const value = useBreakpointValue({ base: false, lg: true }, { ssr: false });
  return <Flex>{value() ? 'true' : 'false'}</Flex>;
}
