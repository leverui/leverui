import { createMemo } from 'solid-js';
import type { MaybeAccessor } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { type UseHotkeysCommand, type UseHotkeysProps, useHotkeys } from './use-hotkeys';

export type UseHotkeyProps = UseHotkeysCommand & Pick<UseHotkeysProps, 'store'>;

/** Create the hotkey state and return its API. */
export const useHotkey = (props: MaybeAccessor<UseHotkeyProps>) => {
  const resolved = createMemo(() => {
    const { store, ...command } = runIfFn(props);
    return { commands: [command], store };
  });

  useHotkeys(resolved);
};
