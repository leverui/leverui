import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { Button, Listbox, Popover, useFilter, useListCollection } from '../src';
import '../demos/listbox-popover-example.css';

const frameworks = [
  { label: 'React.js', value: 'react' },
  { label: 'SolidJS', value: 'solid' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Nuxt.js', value: 'nuxtjs' },
];

/** Match the guide's decorative chevron without an icon dependency. */
function ChevronDownIcon(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Keep the Listbox machine alive outside the Popover's presence boundary. */
function PopoverListboxContent(props: { gallery?: boolean | undefined }): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal('');
  const matcher = useFilter({ sensitivity: 'base' });

  /** Match framework labels with the current locale's base collation. */
  function contains(text: string, query: string): boolean {
    return matcher().contains(text, query);
  }

  const { collection, filter } = useListCollection({ initialItems: frameworks, filter: contains });

  /** Close after selection and reset the visible collection and input. */
  function changeValue(): void {
    setOpen(false);
    setQuery('');
    filter('');
  }

  const listbox = Listbox.useListbox(
    /** Keep the caller-owned machine synchronized with the filtered collection. */
    () => ({ collection: collection(), onValueChange: changeValue }),
  );

  /** Follow the Popover trigger and dismissal machine. */
  function changeOpen(details: { open: boolean }): void {
    setOpen(details.open);
  }

  /** Update both the controlled input and the primitive collection. */
  function search(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    const text = event.currentTarget.value;
    setQuery(text);
    filter(text);
  }

  return (
    <div style={{ padding: props.gallery ? '24px' : '32px', 'min-height': '420px' }}>
      <Popover.Root open={open()} onOpenChange={changeOpen}>
        <Popover.Trigger
          asChild={
            /** Put machine trigger behavior on the guide's styled button. */
            (getProps) => (
              <Button
                {...getProps()}
                size="sm"
                variant="outline"
                data-testid="popover-listbox-trigger"
              >
                {listbox().selectedItems[0]?.label ?? 'Select'} <ChevronDownIcon />
              </Button>
            )
          }
        />
        <Portal>
          <Popover.Positioner>
            <Popover.Content aria-label="Choose a framework" class="listbox-popover-content">
              <Popover.Body style={{ padding: 0 }}>
                <Listbox.RootProvider value={listbox} style={{ gap: '0', overflow: 'hidden' }}>
                  <Listbox.Input
                    aria-label="Search frameworks"
                    style={{
                      'min-height': 'var(--leverui-sizes-10)',
                      'padding-inline': 'var(--leverui-spacing-3)',
                      'border-top-left-radius': 'var(--leverui-radii-l2)',
                      'border-top-right-radius': 'var(--leverui-radii-l2)',
                      background: 'transparent',
                      outline: '0',
                    }}
                    value={query()}
                    onInput={search}
                  />
                  <Listbox.Content
                    style={{
                      'border-width': '0',
                      'border-top-width': '1px',
                      'border-top-left-radius': '0',
                      'border-top-right-radius': '0',
                      gap: '0',
                    }}
                  >
                    <Listbox.List aria-label="Frameworks">
                      <For each={collection().items}>
                        {
                          /** Keep rendered options in the external machine's collection. */
                          (item) => (
                            <Listbox.Item item={item}>
                              <Listbox.ItemText>{item.label}</Listbox.ItemText>
                              <Listbox.ItemIndicator />
                            </Listbox.Item>
                          )
                        }
                      </For>
                    </Listbox.List>
                  </Listbox.Content>
                </Listbox.RootProvider>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
      {!props.gallery && (
        <output data-testid="popover-listbox-value">{listbox().value.join(',')}</output>
      )}
    </div>
  );
}

/** Supply the locale and theme contexts to the guide composition. */
export function PopoverListboxExample(props: { gallery?: boolean } = {}): JSX.Element {
  return (
    <>
      <PopoverListboxContent gallery={props.gallery} />
    </>
  );
}
