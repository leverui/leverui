import { splitProps } from '../primitives/utils/split-props';
import type {
  ComboboxEmptyProps,
  ComboboxItemGroupLabelProps,
  ComboboxItemGroupProps,
  ComboboxItemProps,
  ComboboxItemTextProps,
} from '../primitives/components/combobox';
import { For, Show } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { useComboboxContext } from '../primitives/components/combobox';
import { useCommandContext } from './command-context';
import { getCommandMatchRanges } from './command-highlight';
import { renderCommandPart, type CommandPartRuntimeProps } from './command-part';

/** A plain or emphasized span from one fuzzy search result. */
interface CommandTextSpan {
  readonly text: string;
  readonly match: boolean;
}

/** Split result text at its highest-scoring matched character ranges. */
function commandTextSpans(text: string, query: string): CommandTextSpan[] {
  const ranges = getCommandMatchRanges(text, query);
  if (ranges.length === 0) return [{ text, match: false }];
  const spans: CommandTextSpan[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start > cursor) spans.push({ text: text.slice(cursor, start), match: false });
    spans.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) spans.push({ text: text.slice(cursor), match: false });
  return spans;
}

/** Bind a result item to the primitive selection while keeping input focus. */
export function CommandItem(props: ComboboxItemProps): JSX.Element {
  return renderCommandPart('item', mergeProps({ persistFocus: true }, props));
}

/** Group related result items under one heading. */
export function CommandItemGroup(props: ComboboxItemGroupProps): JSX.Element {
  return renderCommandPart('itemGroup', props);
}

/** Label one group in the current result list. */
export function CommandItemGroupLabel(props: ComboboxItemGroupLabelProps): JSX.Element {
  return renderCommandPart('itemGroupLabel', props);
}

/** Highlight fuzzy matches when the item text is a string. */
export function CommandItemText(
  props: ComboboxItemTextProps & { highlight?: boolean | undefined },
): JSX.Element {
  const command = useCommandContext();
  const [local, native] = splitProps(props, ['highlight', 'children']);
  const content = mergeProps(native, {
    /** Preserve custom JSX children and decorate only plain text. */
    get children() {
      return (
        <>
          {local.highlight && typeof local.children === 'string' ? (
            <For each={commandTextSpans(local.children, command.filterQuery())}>
              {
                /** Mark only matched fragments without changing the source text. */
                (span) => (span.match ? <mark>{span.text}</mark> : span.text)
              }
            </For>
          ) : (
            local.children
          )}
        </>
      );
    },
  });
  return renderCommandPart('itemText', content);
}

/** Show a keyboard shortcut after a result item. */
export function CommandItemCommand(props: CommandPartRuntimeProps): JSX.Element {
  return renderCommandPart('itemCommand', props);
}

/**
 * Show empty content once loading finishes and no results remain.
 *
 * The primitive's `Empty` stays mounted as a status region beside the list. Command
 * keeps its message inside `Command.List`, so it mounts only while empty
 * and keeps non-option content out of a populated listbox.
 */
export function CommandEmpty(props: ComboboxEmptyProps): JSX.Element {
  const command = useCommandContext();
  const combobox = useComboboxContext();
  return (
    <Show when={!command.loading() && combobox().collection.size === 0}>
      {renderCommandPart('empty', props)}
    </Show>
  );
}
