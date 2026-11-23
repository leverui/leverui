import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Box as BoxExport,
  Checkmark as CheckmarkExport,
  Flex as FlexExport,
  Kbd as KbdExport,
  Listbox as ListboxExport,
  createListCollection as CollectionExport,
} from '../src';
import { extendedFrameworks, selectAllFrameworks } from './listbox-guide-data';

/** Public parts needed to render both selection guides from source or dist. */
export interface ListboxGuideComponents {
  Box: typeof BoxExport;
  Checkmark: typeof CheckmarkExport;
  Flex: typeof FlexExport;
  Kbd: typeof KbdExport;
  Listbox: typeof ListboxExport;
  createListCollection: typeof CollectionExport;
}

/** Bind each option's checkmark to the owning Listbox machine. */
function ItemCheckmark(props: Pick<ListboxGuideComponents, 'Checkmark' | 'Listbox'>): JSX.Element {
  const state = props.Listbox.useListboxItemContext();
  return (
    <props.Checkmark
      filled
      size="sm"
      checked={state().selected}
      disabled={state().disabled}
      aria-hidden="true"
    />
  );
}

/** Render the Select All header in the same machine as its ten options. */
function SelectAllHeader(props: Pick<ListboxGuideComponents, 'Checkmark' | 'Flex' | 'Listbox'>) {
  const machine = props.Listbox.useListboxContext();
  /** Report whether every collection value is selected. */
  function allSelected(): boolean {
    return machine().value.length === selectAllFrameworks.length;
  }
  /** Report whether the header should show the mixed-state glyph. */
  function someSelected(): boolean {
    return machine().value.length > 0 && !allSelected();
  }
  /** Expose all three toggle states to assistive technology. */
  function pressedState(): 'true' | 'mixed' | 'false' {
    return allSelected() ? 'true' : someSelected() ? 'mixed' : 'false';
  }
  /** Toggle all framework values in one machine update. */
  function toggleAll(): void {
    machine().setValue(
      allSelected()
        ? []
        : selectAllFrameworks.map(
            /** Read the collection's stable value without deriving it from a label. */
            (item) => item.value,
          ),
    );
  }

  return (
    <props.Flex
      as="button"
      type="button"
      onClick={toggleAll}
      aria-pressed={pressedState()}
      data-testid="listbox-select-all"
      align="center"
      style={{
        'padding-inline': 'var(--lui-spacing-3)',
        gap: 'var(--lui-spacing-2)',
        cursor: 'pointer',
        border: '1px solid var(--lui-colors-border)',
        'min-height': 'var(--lui-sizes-10)',
        'border-start-start-radius': 'var(--lui-radii-l2)',
        'border-start-end-radius': 'var(--lui-radii-l2)',
        'margin-bottom': '-1px',
      }}
    >
      <props.Checkmark
        filled
        size="sm"
        checked={allSelected()}
        indeterminate={someSelected()}
        aria-hidden="true"
      />
      <props.Listbox.Label>Select Frameworks</props.Listbox.Label>
    </props.Flex>
  );
}

/** Render the ten-option Select All composition. */
export function renderSelectAllGuide(
  components: ListboxGuideComponents,
  initialValue: readonly string[] = [],
): JSX.Element {
  const { Box, Checkmark, Flex, Listbox } = components;
  const collection = components.createListCollection({ items: selectAllFrameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Box style={{ 'max-width': '320px' }}>
          <Listbox.Root
            collection={collection}
            selectionMode="multiple"
            defaultValue={[...initialValue]}
            style={{ gap: '0' }}
          >
            <SelectAllHeader Checkmark={Checkmark} Flex={Flex} Listbox={Listbox} />
            <Listbox.Content
              style={{
                'max-height': '300px',
                'border-top-left-radius': '0',
                'border-top-right-radius': '0',
              }}
            >
              <Listbox.List>
                <For each={collection.items}>
                  {
                    /** Keep the marker and text inside the same selectable option. */
                    (item) => (
                      <Listbox.Item item={item}>
                        <ItemCheckmark Checkmark={Checkmark} Listbox={Listbox} />
                        <Listbox.ItemText>{item.label}</Listbox.ItemText>
                      </Listbox.Item>
                    )
                  }
                </For>
              </Listbox.List>
            </Listbox.Content>
          </Listbox.Root>
        </Box>
      </div>
    </>
  );
}

/** Render the four-option Extended Select composition. */
export function renderExtendedGuide(
  components: ListboxGuideComponents,
  initialValue: readonly string[] = [],
): JSX.Element {
  const { Kbd, Listbox } = components;
  const collection = components.createListCollection({ items: extendedFrameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          selectionMode="extended"
          defaultValue={[...initialValue]}
        >
          <Listbox.Label>
            Select frameworks (hold <Kbd>⌘</Kbd> or <Kbd>^</Kbd> to select multiple)
          </Listbox.Label>
          <Listbox.Content style={{ 'max-width': '320px' }}>
            <Listbox.List>
              <For each={collection.items}>
                {
                  /** Preserve the option order under the primitive machine. */
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
        </Listbox.Root>
      </div>
    </>
  );
}
