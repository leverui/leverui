import type { ComboboxSelectionDetails } from '../primitives/components/combobox';

/** The event shape emitted when a Command item is activated. */
/** Modifier keys held when a Command item was selected. */
export interface CommandModifierKeys {
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

/** The primitive's selection details plus the modifier keys Lever records for each selection. */
export type CommandSelectionDetails = ComboboxSelectionDetails & {
  modifiers: CommandModifierKeys;
};

/** Data used by a Command collection; consumers may extend it with their own fields. */
export interface CommandItem {
  value?: string | undefined;
  label?: string | undefined;
  disabled?: boolean | undefined;
  keywords?: readonly string[] | undefined;
  parent?: string | undefined;
  page?: boolean | undefined;
  /** Run an action before the root-level selection callback. */
  onSelect?: ((details: CommandSelectionDetails) => void) | undefined;
  closeOnSelect?: boolean | undefined;
}
