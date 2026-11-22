import { createMemo, type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { CommandInputKeyEvent } from './command-collection-navigation';
import type { CommandItem } from './command-types';
import type { CommandSelectItemOptions } from './use-command';
import type { UseCommandCollectionReturn } from './use-command-collection';

/** The non-generic behavior consumed by Command's compound parts. */
export interface CommandContextState {
  readonly loading: Accessor<boolean>;
  readonly query: Accessor<string>;
  readonly filterQuery: Accessor<string>;
  readonly getFirstMatchValue: (query: string) => string | undefined;
  readonly shouldUseFirstMatch: () => boolean;
  readonly selectItemByValue: (value: string, options?: CommandSelectItemOptions) => void;
  readonly onInputKeyDown: (event: CommandInputKeyEvent) => boolean;
}

const CommandContext = createOptionalContext<CommandContextState>();
const CommandSourceContext = createOptionalContext<Accessor<unknown>>();

/** Give Command parts the root's search and selection behavior. */
export const CommandContextProvider = CommandContext;

/** Read the nearest Command root's behavior. */
export function useCommandContext(): CommandContextState {
  const state = useOptionalContext(CommandContext);
  if (!state) throw new Error('Command parts must be inside Command.Root.');
  return state;
}

/** Share a reactive collection with one or more Command roots. */
export function CommandProvider<T extends CommandItem>(props: {
  value: UseCommandCollectionReturn<T>;
  children: JSX.Element;
}): JSX.Element {
  const source = createMemo(
    /** Follow a caller-provided replacement collection. */
    () => props.value,
  );
  return <CommandSourceContext value={source}>{props.children}</CommandSourceContext>;
}

/** Recover the caller's item type at the provider-to-root boundary. */
export function useCommandSource<T extends CommandItem>():
  UseCommandCollectionReturn<T> | undefined {
  const source = useOptionalContext(CommandSourceContext);
  return source?.() as UseCommandCollectionReturn<T> | undefined;
}
