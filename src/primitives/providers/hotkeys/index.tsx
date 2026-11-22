export { useFormatHotkey, type UseFormatHotkeyReturn } from './use-format-hotkey';
export { useHotkey, type UseHotkeyProps } from './use-hotkey';
export {
  useHotkeyRecorder,
  type UseHotkeyRecorderProps,
  type UseHotkeyRecorderReturn,
} from './use-hotkey-recorder';
export { useHotkeyRegistrations } from './use-hotkey-registrations';
export { useHotkeyStore, type UseHotkeyStoreProps } from './use-hotkey-store';
export { useHotkeys, type UseHotkeysCommand, type UseHotkeysProps } from './use-hotkeys';
export { useIsKeyPressed, type UseIsKeyPressedProps } from './use-is-key-pressed';
export { usePlatform, type Platform } from './use-platform';
export { usePressedKeys } from './use-pressed-keys';

export {
  createHotkeyStore,
  formatHotkey,
  isHotKey,
  isHotkeyEqual,
  parseHotkey,
  validateHotkey,
} from '@zag-js/hotkeys';
export type {
  CommandDefinition,
  ConflictBehavior,
  HotkeyAction,
  HotkeyCommand,
  HotkeyFormatOptions,
  HotkeyOptions,
  HotkeyStore,
  HotkeyStoreOptions,
  ParsedHotkey,
  RecordedHotkey,
} from '@zag-js/hotkeys';
