import { useSyncExternalStore } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import type { MaybeAccessor } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { type UseHotkeyStoreProps, useHotkeyStore } from './use-hotkey-store';

export interface UseIsKeyPressedProps extends UseHotkeyStoreProps {
  /**
   * The key or combination to watch.
   */
  hotkey: string;
}

/** Create the is key pressed state and return its API. */
export const useIsKeyPressed = (props: MaybeAccessor<UseIsKeyPressedProps>): Accessor<boolean> => {
  const store = useHotkeyStore({ store: runIfFn(props).store });
  /** Hotkey. */
  const hotkey = () => runIfFn(props).hotkey;

  return useSyncExternalStore(
    (listener) => store.subscribe(() => store.isPressed(hotkey()), listener),
    () => store.isPressed(hotkey()),
  );
};
