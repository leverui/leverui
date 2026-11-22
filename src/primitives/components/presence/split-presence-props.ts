import { createSplitProps } from '../../utils/create-split-props';
import type { UsePresenceProps } from './use-presence';

/** Split the presence props from the remaining props. */
export const splitPresenceProps = <T extends UsePresenceProps>(props: T) =>
  createSplitProps<UsePresenceProps>()(props, [
    'immediate',
    'lazyMount',
    'onEnterComplete',
    'onExitComplete',
    'present',
    'skipAnimationOnMount',
    'unmountOnExit',
  ]);
