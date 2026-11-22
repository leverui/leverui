import {
  useCombobox,
  type ComboboxInputValueChangeDetails,
  type UseComboboxProps,
  type UseComboboxReturn,
} from '../primitives/components/combobox';
import { type ListCollection } from '../primitives/components/collection';
import { createEffect, createMemo, createSignal, createUniqueId, type Accessor } from 'solid-js';
import type { CommandItem, CommandModifierKeys, CommandSelectionDetails } from './command-types';
import type { UseCommandCollectionReturn } from './use-command-collection';

export type { CommandModifierKeys } from './command-types';

/** User-facing options for a Command machine backed by the primitive Combobox. */
export interface UseCommandProps<T extends CommandItem> {
  collection?: ListCollection<T> | undefined;
  command?: UseCommandCollectionReturn<T> | undefined;
  defaultHighlightedValue?: UseComboboxProps<T>['defaultHighlightedValue'];
  highlightedValue?: UseComboboxProps<T>['highlightedValue'];
  id?: UseComboboxProps<T>['id'];
  ids?: UseComboboxProps<T>['ids'];
  navigate?: UseComboboxProps<T>['navigate'];
  onHighlightChange?: UseComboboxProps<T>['onHighlightChange'];
  scrollToIndexFn?: UseComboboxProps<T>['scrollToIndexFn'];
  loading?: boolean | undefined;
  closeOnSelect?: boolean | undefined;
  /** Close the surrounding dialog after an ordinary action. */
  onClose?: (() => void) | undefined;
  /** Observe a selected action after its own callback runs. */
  onSelect?: ((details: CommandSelectionDetails) => void) | undefined;
  inputValue?: string | undefined;
  defaultInputValue?: string | undefined;
  /** Observe input changes after the collection query updates. */
  onInputValueChange?: ((details: ComboboxInputValueChangeDetails) => void) | undefined;
}

/** Options for selecting an item outside the primitive's normal pointer or keyboard path. */
export interface CommandSelectItemOptions {
  modifiers?: CommandModifierKeys | undefined;
}

/** The machine, source collection, and actions shared by Command parts. */
export interface UseCommandReturn<T extends CommandItem> {
  readonly combobox: UseComboboxReturn<T>;
  readonly command: Accessor<UseCommandCollectionReturn<T> | undefined>;
  readonly loading: Accessor<boolean>;
  /** Execute an item using the same action and close policy as a primitive selection. */
  readonly selectItem: (item: T, options?: CommandSelectItemOptions) => void;
  /**
   * Record the modifier keys of a keydown or click before the machine handles
   * it. Zag 2 no longer passes modifiers to `onSelect`, so Command roots call
   * this from capture-phase listeners.
   */
  readonly recordModifiers: (event: KeyboardEvent | MouseEvent) => void;
}

const noModifiers: CommandModifierKeys = {
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
};

/** Keep a modified activation open for link and multi-action workflows. */
function hasModifier(modifiers: CommandModifierKeys): boolean {
  return modifiers.metaKey || modifiers.ctrlKey || modifiers.shiftKey || modifiers.altKey;
}

/** Adapt a Command collection to the primitive's always-open action combobox. */
export function useCommand<T extends CommandItem>(
  props: UseCommandProps<T> | Accessor<UseCommandProps<T>>,
): UseCommandReturn<T> {
  const defaultId = createUniqueId();
  /** Read fixed or reactive caller options without freezing Solid props. */
  function readProps(): UseCommandProps<T> {
    return typeof props === 'function' ? props() : props;
  }

  const [uncontrolledInput, setUncontrolledInput] = createSignal(
    readProps().defaultInputValue ?? '',
  );
  const command = createMemo(
    /** Follow a replacement collection accessor supplied by the caller. */
    () => readProps().command,
  );
  const collection = createMemo(
    /** Require explicit data rather than silently rendering an empty palette. */
    () => {
      const current = command()?.().collection ?? readProps().collection;
      if (!current)
        throw new Error('Command requires a collection or useCommandCollection source.');
      return current;
    },
  );
  const inputValue = createMemo(
    /** The collection query owns input text when a Command source is present. */
    () => command()?.().query ?? readProps().inputValue ?? uncontrolledInput(),
  );
  const loading = createMemo(
    /** Let an explicit loading prop override remote collection state. */
    () => readProps().loading ?? command()?.().loading ?? false,
  );

  let recordedModifiers = noModifiers;

  /** Remember the modifiers of the event that may select an item next. */
  function recordModifiers(event: KeyboardEvent | MouseEvent): void {
    recordedModifiers = {
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
    };
  }

  /** Read and clear the modifiers recorded for the current selection. */
  function takeModifiers(): CommandModifierKeys {
    const modifiers = recordedModifiers;
    recordedModifiers = noModifiers;
    return modifiers;
  }

  /** Update the local input and notify both the collection and caller. */
  function changeInput(details: ComboboxInputValueChangeDetails): void {
    if (readProps().inputValue === undefined && !command())
      setUncontrolledInput(details.inputValue);
    command()?.().search(details.inputValue);
    readProps().onInputValueChange?.(details);
  }

  /** Run item and root actions before applying page and close policy. */
  function runSelect(details: CommandSelectionDetails, item: T | null | undefined): void {
    item?.onSelect?.(details);
    readProps().onSelect?.(details);
    if (command()?.().onSelect(details)) return;
    const shouldClose = (readProps().closeOnSelect ?? true) && !hasModifier(details.modifiers);
    if (item?.closeOnSelect ?? shouldClose) readProps().onClose?.();
  }

  const combobox = useCombobox<T>(
    /** Keep the primitive's collection, input, and loading options reactive. */
    () => ({
      collection: collection(),
      inputBehavior: 'autohighlight',
      selectionBehavior: 'preserve',
      loopFocus: false,
      defaultHighlightedValue: readProps().defaultHighlightedValue ?? collection().firstValue,
      highlightedValue: readProps().highlightedValue,
      id: readProps().id ?? defaultId,
      ids: readProps().ids,
      navigate: readProps().navigate,
      onHighlightChange: readProps().onHighlightChange,
      scrollToIndexFn: readProps().scrollToIndexFn,
      inputValue: inputValue(),
      onInputValueChange: changeInput,
      // Zag 2 replaced `disableLayer` with `inline`: always open, never
      // positioned or dismissed, so the enclosing dialog owns dismissal.
      inline: true,
      loading: loading(),
      value: [],
      onSelect:
        /** Resolve the selected item before applying Command actions. */
        (details) =>
          runSelect(
            { ...details, modifiers: takeModifiers() },
            collection().find(details.itemValue),
          ),
    }),
  );

  createEffect(
    /** Track the page's preferred highlight and the combobox API. */
    () => ({ preferred: command()?.().highlightedValue, api: combobox() }),
    /** Restore the page item highlight after returning from a nested page. */
    ({ preferred, api }) => {
      if (preferred && api.collection.has(preferred) && api.highlightedValue !== preferred) {
        api.setHighlightedValue(preferred);
      }
    },
  );

  /** Select an item through the same code path as the primitive's native event. */
  function selectItem(item: T, options: CommandSelectItemOptions = {}): void {
    runSelect(
      {
        itemValue: collection().getItemValue(item) ?? '',
        value: [],
        modifiers: options.modifiers ?? noModifiers,
      },
      item,
    );
  }

  return { combobox, command, loading, selectItem, recordModifiers };
}
