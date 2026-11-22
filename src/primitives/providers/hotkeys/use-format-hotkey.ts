import { type HotkeyFormatOptions, formatHotkey } from '@zag-js/hotkeys';
import { usePlatform } from './use-platform';

export type UseFormatHotkeyReturn = (hotkey: string, options?: HotkeyFormatOptions) => string;

/** Create the format hotkey state and return its API. */
export const useFormatHotkey = (): UseFormatHotkeyReturn => {
  const platform = usePlatform();

  return (hotkey: string, options: HotkeyFormatOptions = {}) =>
    formatHotkey(hotkey, { platform: platform(), ...options });
};
