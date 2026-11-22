import { splitProps } from '../primitives/utils/split-props';
import { Combobox as PrimitiveCombobox } from '../primitives/components/combobox';
import { onCleanup } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { mergeRefs, type LeverUIRef } from '../merge-refs';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import {
  commandAppearanceAttributes,
  CommandAppearanceProvider,
  readCommandPalette,
  readCommandSize,
  type CommandAppearance,
  type CommandAppearanceState,
} from './command-appearance';
import {
  CommandContextProvider,
  useCommandSource,
  type CommandContextState,
} from './command-context';
import { useCommandDialogClose } from './command-dialog';
import type { CommandItem } from './command-types';
import { useCommand, type UseCommandProps, type UseCommandReturn } from './use-command';

/** Native and finite appearance props shared by both Command root modes. */
export type CommandRootPresentationProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'size'
> &
  CommandAppearance & {
    className?: string | undefined;
  };

/** A Command root that owns its primitive combobox machine. */
export type CommandRootProps<T extends CommandItem> = CommandRootPresentationProps &
  UseCommandProps<T>;

/** A Command root driven by a caller-owned machine. */
export type CommandRootProviderProps<T extends CommandItem> = CommandRootPresentationProps & {
  value: UseCommandReturn<T>;
};

/** Render a CSS-first Command root around a caller-owned primitive machine. */
export function CommandRootProvider<T extends CommandItem>(
  props: CommandRootProviderProps<T>,
): JSX.Element {
  const [local, native] = splitProps(props, [
    'value',
    'children',
    'size',
    'colorPalette',
    'unstyled',
    'class',
    'className',
  ]);
  const appearance: CommandAppearanceState = {
    /** Validate changing size values before CSS sees them. */
    size: () => readCommandSize(local.size),
    /** Keep named and consumer palette choices reactive. */
    colorPalette: () => readCommandPalette(local.colorPalette),
    /** Suppress authored presentation without changing the primitive state. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Find the top result's value without exposing the item's generic type. */
  function getFirstMatchValue(query: string): string | undefined {
    const item = local.value.command()?.()?.getFirstMatch(query);
    return item ? (local.value.combobox().collection.getItemValue(item) ?? undefined) : undefined;
  }

  /** Select a value through the root's typed collection. */
  function selectItemByValue(
    value: string,
    options?: Parameters<UseCommandReturn<T>['selectItem']>[1],
  ): void {
    const item = local.value.combobox().collection.find(value);
    if (item) local.value.selectItem(item, options);
  }

  /** Preserve an explicitly arrow-highlighted item during deferred filtering. */
  function shouldUseFirstMatch(): boolean {
    const combobox = local.value.combobox();
    return (
      !combobox.highlightedValue || combobox.highlightedValue === combobox.collection.firstValue
    );
  }

  const behavior: CommandContextState = {
    /** Read remote activity without freezing a replacement machine prop. */
    loading: () => local.value.loading(),
    /** Follow the visible search text from the source or primitive machine. */
    query: () => local.value.command()?.()?.query ?? local.value.combobox().inputValue,
    /** Use the ranking query when deferred filtering is active. */
    filterQuery: () => local.value.command()?.()?.filterQuery ?? local.value.combobox().inputValue,
    getFirstMatchValue,
    shouldUseFirstMatch,
    selectItemByValue,
    /** Delegate nested page keys to the collection when supplied. */
    onInputKeyDown: (event) => local.value.command()?.()?.onInputKeyDown(event) ?? false,
  };

  let stopListening: (() => void) | undefined;

  /**
   * Record each keydown's and click's modifiers before Zag handles them, so a
   * modified selection keeps the palette open. Capture runs ahead of Zag's
   * own item and input handlers.
   */
  function listenForModifiers(element: HTMLDivElement): void {
    const record = local.value.recordModifiers;
    element.addEventListener('keydown', record, true);
    element.addEventListener('click', record, true);
    stopListening =
      /** Remove both listeners from this element. */
      () => {
        element.removeEventListener('keydown', record, true);
        element.removeEventListener('click', record, true);
      };
  }

  // Solid registers cleanup from the component body, not from inside a ref callback.
  onCleanup(
    /** Stop listening when the root unmounts. */
    () => stopListening?.(),
  );

  return (
    <CommandContextProvider value={behavior}>
      <CommandAppearanceProvider value={appearance}>
        <PrimitiveCombobox.RootProvider
          {...native}
          {...commandAppearanceAttributes(appearance)}
          value={local.value.combobox}
          class={composeRecipeClassNames('command__root', undefined, local.class, local.className)}
          data-unstyled={appearance.unstyled() ? '' : undefined}
          data-loading={local.value.loading() ? '' : undefined}
          data-empty={local.value.combobox().collection.size === 0 ? '' : undefined}
          ref={mergeRefs(native.ref as LeverUIRef<HTMLDivElement>, listenForModifiers)}
        >
          {local.children}
        </PrimitiveCombobox.RootProvider>
      </CommandAppearanceProvider>
    </CommandContextProvider>
  );
}

/** Build a primitive command machine from reactive Solid props. */
export function CommandRoot<T extends CommandItem>(props: CommandRootProps<T>): JSX.Element {
  const source = useCommandSource<T>();
  const closeDialog = useCommandDialogClose();
  const [machine, presentation] = splitProps(props, [
    'collection',
    'command',
    'loading',
    'closeOnSelect',
    'onClose',
    'onSelect',
    'inputValue',
    'defaultInputValue',
    'onInputValueChange',
    'defaultHighlightedValue',
    'highlightedValue',
    'id',
    'ids',
    'navigate',
    'onHighlightChange',
    'scrollToIndexFn',
  ]);
  const value = useCommand<T>(
    /** Inherit a source only when this root does not supply one. */
    () => ({
      ...machine,
      command: machine.command ?? source,
      onClose: machine.onClose ?? closeDialog,
    }),
  );
  return <CommandRootProvider {...presentation} value={value} />;
}
