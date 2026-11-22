import type { HotkeyCommand, HotkeyStoreState } from '@zag-js/hotkeys';
import { useSyncExternalStore } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import { type UseHotkeyStoreProps, useHotkeyStore } from './use-hotkey-store';

/** Get the version. */
const getVersion = (state: HotkeyStoreState) =>
  Array.from(
    state.commands.values(),
    (command) => `${command.id}:${command.hotkey}:${command.label ?? ''}`,
  ).join('|');

/** Create the hotkey registrations state and return its API. */
export const useHotkeyRegistrations = (
  props: UseHotkeyStoreProps = {},
): Accessor<HotkeyCommand[]> => {
  const store = useHotkeyStore(props);

  return useSyncExternalStore(
    (listener) => store.subscribe(getVersion, listener),
    () => Array.from(store.getState().commands.values()),
  );
};
