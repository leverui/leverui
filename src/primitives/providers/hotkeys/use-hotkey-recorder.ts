import {
  type HotkeyRecorderOptions,
  type HotkeyRecorderState,
  createHotkeyRecorder,
} from '@zag-js/hotkeys';
import { useSyncExternalStore } from '@zag-js/solid';
import { type Accessor, onSettled } from 'solid-js';
import type { MaybeAccessor } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { useEnvironmentContext } from '../environment/use-environment-context';

export type UseHotkeyRecorderProps = Omit<HotkeyRecorderOptions, 'target'>;

export interface UseHotkeyRecorderReturn {
  /**
   * The current recorder state.
   */
  state: Accessor<HotkeyRecorderState>;
  /**
   * Start listening for key events.
   */
  start: () => void;
  /**
   * Stop listening and finalize the recorded hotkey.
   */
  stop: () => void;
  /**
   * Stop listening and discard the recorded hotkey.
   */
  cancel: () => void;
  /**
   * Clear the recorded hotkey.
   */
  clear: () => void;
}

/** Create the hotkey recorder state and return its API. */
export const useHotkeyRecorder = (
  props: MaybeAccessor<UseHotkeyRecorderProps> = {},
): UseHotkeyRecorderReturn => {
  const env = useEnvironmentContext();
  const recorder = createHotkeyRecorder();

  onSettled(() => {
    const options = runIfFn(props);

    recorder.init(env().getRootNode() as Document);
    recorder.setOptions({
      /** Handle record. */
      onRecord: (hotkey) => runIfFn(props).onRecord?.(hotkey),
      /** Handle cancel. */
      onCancel: () => runIfFn(props).onCancel?.(),
      /** Handle clear. */
      onClear: () => runIfFn(props).onClear?.(),
      ...(options.formatOptions && { formatOptions: options.formatOptions }),
      ...(options.sequenceTimeoutMs !== undefined && {
        sequenceTimeoutMs: options.sequenceTimeoutMs,
      }),
    });

    return () => recorder.destroy();
  });

  const state = useSyncExternalStore(
    (listener) => recorder.subscribe(listener),
    () => recorder.getState(),
  );

  return {
    state,
    /** Start. */
    start: () => void recorder.start(),
    /** Stop. */
    stop: () => void recorder.stop(),
    /** Cancel. */
    cancel: () => void recorder.cancel(),
    /** Clear. */
    clear: () => void recorder.clear(),
  };
};
