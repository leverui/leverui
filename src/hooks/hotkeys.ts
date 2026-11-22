/** Expose the primitive Solid's scoped hotkey primitives through Lever UI's public hooks. */
export {
  createHotkeyStore,
  formatHotkey,
  useFormatHotkey,
  useHotkey,
  useHotkeyRegistrations,
  useHotkeyStore,
  useHotkeys,
  useIsKeyPressed,
  usePlatform,
  usePressedKeys,
} from '../primitives/providers/hotkeys';

export type {
  HotkeyCommand,
  HotkeyFormatOptions,
  HotkeyOptions,
  HotkeyStore,
  UseHotkeyProps,
  UseHotkeysCommand,
  UseHotkeysProps,
} from '../primitives/providers/hotkeys';
