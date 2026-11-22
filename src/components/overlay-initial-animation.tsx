import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';

const InitialAnimationContext = createOptionalContext<Accessor<boolean>>();

/** Leave animation unchanged outside an overlay root. */
function allowAnimation(): boolean {
  return false;
}

/** Share whether the first open state should suppress slot animation. */
export function InitialAnimationProvider(props: {
  suppressed: Accessor<boolean>;
  children?: JSX.Element;
}): JSX.Element {
  /** Follow the current initial animation state through the context boundary. */
  function readSuppressed(): boolean {
    return props.suppressed();
  }
  return <InitialAnimationContext value={readSuppressed}>{props.children}</InitialAnimationContext>;
}

/** Read the nearest overlay's initial animation policy. */
export function useInitialAnimationSuppressed(): Accessor<boolean> {
  return useOptionalContext(InitialAnimationContext) ?? allowAnimation;
}
