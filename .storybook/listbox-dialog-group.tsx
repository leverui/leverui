import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Listbox as ListboxExport, Span as SpanExport } from '../src';
import type { DialogCommandItem } from './listbox-dialog-data';

export interface ListboxDialogGroupProps {
  Listbox: typeof ListboxExport;
  Span: typeof SpanExport;
  group: string;
  items: readonly DialogCommandItem[];
}

/** Render one accessible command group from the current collection. */
export function ListboxDialogGroup(props: ListboxDialogGroupProps): JSX.Element {
  const Listbox = props.Listbox;
  const Span = props.Span;
  return (
    <Listbox.ItemGroup>
      <Listbox.ItemGroupLabel class="listbox-dialog-group-label">
        {props.group}
      </Listbox.ItemGroupLabel>
      <For each={props.items}>
        {
          /** Keep each visible option tied to its collection item. */
          (item) => (
            <Listbox.Item item={item} style={{ 'justify-content': 'space-between' }}>
              <Listbox.ItemText>{item.label}</Listbox.ItemText>
              <Span
                style={{
                  'font-size': 'var(--lui-font-sizes-xs)',
                  color: 'var(--lui-colors-fg-muted)',
                }}
              >
                {item.type}
              </Span>
            </Listbox.Item>
          )
        }
      </For>
    </Listbox.ItemGroup>
  );
}
