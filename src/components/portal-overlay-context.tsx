import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';

const OverlayOpenContext = createOptionalContext<Accessor<boolean>>();

/** Share the owning overlay's open state with nested portals. */
export function OverlayOpenProvider(props: {
  open: Accessor<boolean>;
  children?: JSX.Element;
}): JSX.Element {
  /** Follow a replacement accessor as well as its changing state. */
  function readOpen(): boolean {
    return props.open();
  }
  return <OverlayOpenContext value={readOpen}>{props.children}</OverlayOpenContext>;
}

/** Read the nearest overlay state without depending on its state machine. */
export function useOverlayOpen(): Accessor<boolean> | undefined {
  return useOptionalContext(OverlayOpenContext);
}
