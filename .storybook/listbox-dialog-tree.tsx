import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Button as ButtonExport,
  Dialog as DialogExport,
  HStack as HStackExport,
  Kbd as KbdExport,
  Listbox as ListboxExport,
  Portal as PortalExport,
  Span as SpanExport,
  useFilter as FilterExport,
  useListCollection as CollectionExport,
} from '../src';
import { dialogCommands, type DialogCommandItem } from './listbox-dialog-data';
import { ListboxDialogGroup } from './listbox-dialog-group';
import './listbox-dialog.css';

export type ListboxDialogComponents = {
  Button: typeof ButtonExport;
  Dialog: typeof DialogExport;
  HStack: typeof HStackExport;
  Kbd: typeof KbdExport;
  Listbox: typeof ListboxExport;
  Portal: typeof PortalExport;
  Span: typeof SpanExport;
  useFilter: typeof FilterExport;
  useListCollection: typeof CollectionExport;
};

export type ListboxDialogOptions = { readonly initiallyOpen?: boolean; readonly gallery?: boolean };

/** Keep the guide's two command groups in their documented order. */
function commandGroup(item: DialogCommandItem): DialogCommandItem['type'] {
  return item.type;
}

/** Render the same Dialog and Listbox tree in Storybook and published hydration. */
export function renderListboxDialog(
  components: ListboxDialogComponents,
  options: ListboxDialogOptions = {},
): JSX.Element {
  const { Button, Dialog, HStack, Kbd, Listbox, Portal, Span, useFilter, useListCollection } =
    components;
  const [open, setOpen] = createSignal(options.initiallyOpen ?? false);
  const [value, setValue] = createSignal<string[]>([]);
  const matcher = useFilter({ sensitivity: 'base' });

  /** Match command labels with the current locale's base collation. */
  function contains(text: string, query: string): boolean {
    return matcher().contains(text, query);
  }

  const { collection, filter } = useListCollection({
    initialItems: dialogCommands,
    filter: contains,
    groupBy: commandGroup,
    groupSort: ['applications', 'commands'],
  });

  /** Follow Dialog trigger and dismissal changes. */
  function changeOpen(details: { open: boolean }): void {
    setOpen(details.open);
  }

  /** Save the selected command before closing the dialog. */
  function changeValue(details: { value: string[] }): void {
    setValue(details.value);
    setOpen(false);
    filter('');
  }

  /** Keep the filtered collection tied to the search input. */
  function search(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    filter(event.currentTarget.value);
  }

  /** Let Escape dismiss the Dialog when the search input owns focus. */
  function dismissFromSearch(event: KeyboardEvent): void {
    if (event.key === 'Escape') setOpen(false);
  }

  /** Render one keyboard hint with the guide's compact key styling. */
  function CommandHint(props: { label: string; keys: readonly string[] }): JSX.Element {
    return (
      <HStack>
        {props.label} <Kbd size="sm">{props.keys.join(' ')}</Kbd>
      </HStack>
    );
  }

  return (
    <>
      <div style={{ padding: options.gallery ? '24px' : '32px', 'min-height': '420px' }}>
        <Dialog.Root
          id="listbox-dialog-guide"
          open={open()}
          onOpenChange={changeOpen}
          placement={options.gallery ? undefined : 'center'}
        >
          <Dialog.Trigger
            asChild={
              /** Apply Dialog trigger behavior to the outlined guide button. */
              (getProps) => (
                <Button {...getProps()} variant="outline" data-testid="dialog-listbox-trigger">
                  Open Search
                </Button>
              )
            }
          />
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content aria-label="Search apps or commands">
                <Listbox.Root
                  collection={collection()}
                  value={value()}
                  onValueChange={changeValue}
                  variant="plain"
                >
                  <Dialog.Header>
                    <Listbox.Input
                      aria-label="Search apps or commands"
                      placeholder="Search for apps or command..."
                      autoHighlight
                      style={{
                        'min-height': 'var(--leverui-sizes-6)',
                        outline: '0',
                        width: '100%',
                      }}
                      onInput={search}
                      onKeyDown={dismissFromSearch}
                    />
                  </Dialog.Header>
                  <Listbox.Content class="listbox-dialog-results">
                    <Listbox.List aria-label="Search results">
                      <For each={collection().group()}>
                        {
                          /** Preserve the group labels and item order. */
                          ([group, items]) => (
                            <ListboxDialogGroup
                              Listbox={Listbox}
                              Span={Span}
                              group={group}
                              items={items}
                            />
                          )
                        }
                      </For>
                    </Listbox.List>
                  </Listbox.Content>
                  <Dialog.Footer class="listbox-dialog-footer">
                    <CommandHint label="Press Esc to close" keys={['Esc']} />
                    <CommandHint label="Open Application" keys={['⏎']} />
                    <CommandHint label="Actions" keys={['⌘', 'K']} />
                  </Dialog.Footer>
                </Listbox.Root>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
        <output data-testid="dialog-listbox-value">{value().join(',')}</output>
        {!options.gallery && (
          <button type="button" data-testid="dialog-listbox-other-focus">
            Other action
          </button>
        )}
      </div>
    </>
  );
}
