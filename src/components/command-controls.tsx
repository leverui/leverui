import { splitProps } from '../primitives/utils/split-props';
import type {
  ComboboxClearTriggerProps,
  ComboboxContentProps,
  ComboboxControlProps,
  ComboboxInputProps,
  ComboboxLabelProps,
} from '../primitives/components/combobox';
import { Combobox as PrimitiveCombobox } from '../primitives/components/combobox';
import { Show } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { useCommandContext } from './command-context';
import { useCommandDialogTitleId, useCommandDialogClose } from './command-dialog';
import { renderCommandPart, type CommandPartRuntimeProps } from './command-part';

/** Expose the active primitive machine to custom actions inside a Command root. */
export const CommandMachineContext = PrimitiveCombobox.Context;

/** Render the default search symbol inside a Command indicator. */
function CommandSearchIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

/** Give the search input an accessible label. */
export function CommandLabel(props: ComboboxLabelProps): JSX.Element {
  return renderCommandPart('label', props);
}

/** Align the search icon, input, and clear trigger. */
export function CommandControl(props: ComboboxControlProps): JSX.Element {
  return renderCommandPart('control', props);
}

/** Show a search symbol or caller-provided indicator. */
export function CommandIndicator(props: CommandPartRuntimeProps): JSX.Element {
  const command = useCommandContext();
  return renderCommandPart(
    'indicator',
    mergeProps(props, {
      /** Show the default icon only when the caller omits children. */
      get children() {
        return <>{props.children ?? <CommandSearchIcon />}</>;
      },
      /** Expose remote loading to consumer CSS. */
      get 'data-loading'() {
        return command.loading() ? '' : undefined;
      },
    }),
  );
}

/** Handle nested navigation and deferred Enter selection around the primitive input. */
export function CommandInput(props: ComboboxInputProps): JSX.Element {
  const command = useCommandContext();
  const dialogTitleId = useCommandDialogTitleId();
  const closeDialog = useCommandDialogClose();
  const [local, native] = splitProps(props, ['onKeyDown']);

  /** Preserve caller key handling before Command's own keyboard policy. */
  function handleKeyDown(
    event: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element },
  ): void {
    const caller = local.onKeyDown;
    if (Array.isArray(caller)) caller[0](caller[1], event);
    else if (typeof caller === 'function') caller(event);
    if (event.isComposing || event.keyCode === 229) return;
    // Inside a Command dialog, the dialog's dismiss layer owns Escape: it pops
    // a page or closes. A standalone Command handles page history here.
    if (event.key === 'Escape' && closeDialog) return;
    command.onInputKeyDown(event);
    if (event.key === 'Escape') return;
    if (event.defaultPrevented || event.key !== 'Enter') return;
    if (command.query() === command.filterQuery()) return;
    if (!command.shouldUseFirstMatch()) return;
    const value = command.getFirstMatchValue(command.query());
    if (!value) return;
    event.preventDefault();
    command.selectItemByValue(value, {
      modifiers: {
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      },
    });
  }

  if (!dialogTitleId) {
    return renderCommandPart('input', mergeProps(native, { onKeyDown: handleKeyDown }));
  }
  const labelled = mergeProps(native, {
    /** Name dialog inputs with their title unless the caller supplies a label. */
    get 'aria-labelledby'() {
      if (native['aria-labelledby'] !== undefined) return native['aria-labelledby'];
      if (native['aria-label'] !== undefined) return undefined;
      return dialogTitleId();
    },
  });
  return renderCommandPart('input', mergeProps(labelled, { onKeyDown: handleKeyDown }));
}

/** Clear the current search query through the primitive's input state. */
export function CommandClearTrigger(props: ComboboxClearTriggerProps): JSX.Element {
  return renderCommandPart('clearTrigger', props);
}

/** Render the always-open Command result surface. */
export function CommandList(props: ComboboxContentProps): JSX.Element {
  const dialogTitleId = useCommandDialogTitleId();
  if (!dialogTitleId) return renderCommandPart('list', props);
  const labelled = mergeProps(props, {
    /** Name dialog results with their title unless the caller supplies a label. */
    get 'aria-labelledby'() {
      if (props['aria-labelledby'] !== undefined) return props['aria-labelledby'];
      if (props['aria-label'] !== undefined) return undefined;
      return dialogTitleId();
    },
  });
  return renderCommandPart('list', labelled);
}

/** Show loading content only while a remote request is active. */
export function CommandLoading(props: CommandPartRuntimeProps): JSX.Element {
  const command = useCommandContext();
  return <Show when={command.loading()}>{renderCommandPart('loading', props)}</Show>;
}

/** Separate result groups without adding an interactive option. */
export function CommandSeparator(props: CommandPartRuntimeProps): JSX.Element {
  return renderCommandPart('separator', props);
}

/** Present keyboard hints or actions below the result list. */
export function CommandFooter(props: CommandPartRuntimeProps): JSX.Element {
  return renderCommandPart('footer', props);
}
