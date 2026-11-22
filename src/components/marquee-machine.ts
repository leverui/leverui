import * as marquee from '@zag-js/marquee';
import { normalizeProps, useMachine, type PropTypes } from '@zag-js/solid';
import { createMemo, createUniqueId, type Accessor } from 'solid-js';
import { useEnvironmentContext } from './environment';
import { useLocaleContext } from './locale';
import { responsiveMarqueeMachine } from './marquee-responsive-machine';

export { useMarqueeContext } from '../primitives/components/marquee';

export type {
  MarqueePauseStatusDetails,
  MarqueeSide,
  UseMarqueeContext,
  UseMarqueeProps,
  UseMarqueeReturn,
} from '../primitives/components/marquee';

import type { UseMarqueeProps, UseMarqueeReturn } from '../primitives/components/marquee';

/** Create primitive-compatible Marquee state with responsive Zag measurements. */
export function useMarquee(props?: UseMarqueeProps | Accessor<UseMarqueeProps>): UseMarqueeReturn {
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();
  const id = createUniqueId();
  const machineProps = createMemo<marquee.Props>(
    /** Resolve caller props and the current primitive locale and environment. */
    () => ({
      id,
      dir: locale().dir,
      getRootNode: environment().getRootNode,
      ...(typeof props === 'function' ? props() : props),
    }),
  );
  const service = useMachine(responsiveMarqueeMachine, machineProps);
  return createMemo<marquee.Api<PropTypes>>(
    /** Expose the same normalized API shape as the primitive's Marquee hook. */
    () => marquee.connect(service, normalizeProps),
  );
}
