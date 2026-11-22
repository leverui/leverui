import * as presence from '@zag-js/presence';
import { normalizeProps, useMachine } from '@zag-js/solid';
import { createEffect, createMemo, createSignal, untrack } from 'solid-js';
import type { MaybeAccessor, Optional } from '../../types';
import { type RenderStrategyProps, splitRenderStrategyProps } from '../../utils/render-strategy';
import { runIfFn } from '../../utils/run-if-fn';

export interface UsePresenceProps extends Optional<presence.Props, 'present'>, RenderStrategyProps {
  /**
   * Whether to allow the initial presence animation.
   * @default false
   */
  skipAnimationOnMount?: boolean | undefined;
}
export type UsePresenceReturn = ReturnType<typeof usePresence>;

/** Create the presence state and return its API. */
export const usePresence = (props: MaybeAccessor<UsePresenceProps>) => {
  const [renderStrategyProps, localProps] = splitRenderStrategyProps(runIfFn(props));
  const [wasEverPresent, setWasEverPresent] = createSignal(false);

  // Zag 2.0.0-next.4 skips `onEnterComplete` on the first open: the machine sets
  // its `initial` flag in a microtask, after the enter effect has already run.
  // Keep the callback away from the machine and report enter completion here.
  const service = useMachine(presence.machine, (): presence.Props => {
    const current = runIfFn(props);
    return {
      present: current.present,
      immediate: current.immediate,
      onExitComplete: current.onExitComplete,
    };
  });
  const api = createMemo(() => presence.connect(service, normalizeProps));
  let presenceNode: HTMLElement | null = null;

  createEffect(
    () => api().present,
    (present, previous) => {
      if (present) setWasEverPresent(true);
      if (!present || previous !== false) return;
      return trackEnterAnimation(
        () => presenceNode,
        () => untrack(() => api().present),
        () => untrack(() => runIfFn(props).onEnterComplete)?.(),
      );
    },
  );

  /** Set the node. */
  const setNode = (node: Element | null) => {
    if (!node) return;
    if (node instanceof HTMLElement) presenceNode = node;
    service.send({ type: 'NODE.SET', node });
  };

  return createMemo(() => ({
    unmounted:
      (!api().present && !wasEverPresent() && renderStrategyProps.lazyMount) ||
      (renderStrategyProps.unmountOnExit && !api().present && wasEverPresent()),
    present: api().present,
    ref: setNode,
    presenceProps: {
      hidden: !api().present,
      'data-state':
        api().skip && localProps.skipAnimationOnMount
          ? undefined
          : localProps.present
            ? 'open'
            : 'closed',
    },
  }));
};

/** Report when a newly presented node has finished its enter animation. */
function trackEnterAnimation(
  getNode: () => HTMLElement | null,
  isPresent: () => boolean,
  onComplete: () => void,
): () => void {
  let frame = 0;
  let cleanupListener: (() => void) | undefined;

  /** Wait for an attached node, then finish now or at the end of its animation. */
  const check = () => {
    frame = requestAnimationFrame(() => {
      const node = getNode();
      if (!node?.isConnected) {
        check();
        return;
      }
      const styles = getComputedStyle(node);
      if (
        (styles.animationName || 'none') === 'none' ||
        styles.display === 'none' ||
        styles.animationDuration === '0s'
      ) {
        onComplete();
        return;
      }
      /** Finish when the node's own animation ends while it is still present. */
      const onEnd = (event: AnimationEvent) => {
        if (event.target !== node || !isPresent()) return;
        node.removeEventListener('animationend', onEnd);
        cleanupListener = undefined;
        onComplete();
      };
      node.addEventListener('animationend', onEnd);
      /** Detach the pending animation listener. */
      cleanupListener = () => node.removeEventListener('animationend', onEnd);
    });
  };

  check();
  return () => {
    cancelAnimationFrame(frame);
    cleanupListener?.();
  };
}
