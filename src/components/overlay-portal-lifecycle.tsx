import { useDialogContext } from '../primitives/components/dialog';
import { createEffect, createMemo, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { InitialAnimationProvider } from './overlay-initial-animation';
import { OverlayOpenProvider } from './portal-overlay-context';

/** Share the nearest primitive Dialog state with portals inside this overlay. */
export function OverlayPortalLifecycle(props: {
  skipAnimationOnMount?: boolean | undefined;
  children?: JSX.Element;
}): JSX.Element {
  const dialog = useDialogContext();
  const [initialOpenFinished, setInitialOpenFinished] = createSignal(!dialog().open);
  const suppressInitialAnimation = createMemo(
    /** Apply the option only while the initially open panel stays open. */
    () => Boolean(props.skipAnimationOnMount && !initialOpenFinished()),
  );

  createEffect(
    /** Track the dialog's open state. */
    () => dialog().open,
    /** Restore ordinary animations as soon as the initial open state closes. */
    (open) => {
      if (!open) setInitialOpenFinished(true);
    },
  );

  /** Keep the provider reactive to a controlled Dialog state. */
  function readOpen(): boolean {
    return dialog().open;
  }

  return (
    <InitialAnimationProvider suppressed={suppressInitialAnimation}>
      <OverlayOpenProvider open={readOpen}>{props.children}</OverlayOpenProvider>
    </InitialAnimationProvider>
  );
}
