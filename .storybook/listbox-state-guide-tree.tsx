import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Code as CodeExport,
  Listbox as ListboxExport,
  Stack as StackExport,
  createListCollection as CollectionExport,
} from '../src';
import { extendedFrameworks as frameworks } from './listbox-guide-data';

/** Public parts shared by source stories and published hydration. */
export interface ListboxStateGuideComponents {
  Code: typeof CodeExport;
  Listbox: typeof ListboxExport;
  Stack: typeof StackExport;
  createListCollection: typeof CollectionExport;
}

export type ListboxStateGuide = 'basic' | 'controlled' | 'store';

/** Render the four options under the current Listbox machine. */
function GuideOptions(props: Pick<ListboxStateGuideComponents, 'Listbox'>): JSX.Element {
  const Listbox = props.Listbox;
  return (
    <>
      <Listbox.Label>Select framework</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={frameworks}>
            {
              /** Keep the option text and indicator under the same machine item. */
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
    </>
  );
}

/** Render the basic machine-owned Listbox. */
function BasicGuide(props: { components: ListboxStateGuideComponents; initialValue: string[] }) {
  const { Listbox, createListCollection } = props.components;
  const collection = createListCollection({ items: frameworks });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Listbox.Root
          collection={collection}
          style={{ width: '320px' }}
          defaultValue={props.initialValue}
        >
          <GuideOptions Listbox={Listbox} />
        </Listbox.Root>
      </div>
    </>
  );
}

/** Render the caller-controlled selection and selected-value readout. */
function ControlledGuide(props: {
  components: ListboxStateGuideComponents;
  initialValue: string[];
}) {
  const { Code, Listbox, Stack, createListCollection } = props.components;
  const collection = createListCollection({ items: frameworks });
  const [value, setValue] = createSignal(props.initialValue);

  /** Keep the caller's signal synchronized with the Listbox machine. */
  function handleValueChange(details: { value: string[] }): void {
    setValue(details.value);
  }

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Stack style={{ 'max-width': '320px', width: '100%' }} gap="4">
          <Listbox.Root collection={collection} value={value()} onValueChange={handleValueChange}>
            <GuideOptions Listbox={Listbox} />
          </Listbox.Root>
          <Code style={{ 'align-self': 'flex-start' }} data-testid="listbox-state-value">
            Selected: {JSON.stringify(value(), null, 2)}
          </Code>
        </Stack>
      </div>
    </>
  );
}

/** Render the caller-owned Listbox store and selected-value readout. */
function StoreGuide(props: { components: ListboxStateGuideComponents; initialValue: string[] }) {
  const { Code, Listbox, Stack, createListCollection } = props.components;
  const collection = createListCollection({ items: frameworks });
  const machine = Listbox.useListbox({ collection, defaultValue: props.initialValue });
  return (
    <>
      <div style={{ padding: '24px' }}>
        <Stack style={{ 'max-width': '320px', width: '100%' }} gap="4">
          <Listbox.RootProvider value={machine}>
            <GuideOptions Listbox={Listbox} />
          </Listbox.RootProvider>
          <Code style={{ 'align-self': 'flex-start' }} data-testid="listbox-state-value">
            Selected: {JSON.stringify(machine().value, null, 2)}
          </Code>
        </Stack>
      </div>
    </>
  );
}

/** Select one root-state guide with matching source and published package parts. */
export function renderListboxStateGuide(
  components: ListboxStateGuideComponents,
  guide: ListboxStateGuide,
  initialValue: readonly string[] = [],
): JSX.Element {
  const props = { components, initialValue: [...initialValue] };
  switch (guide) {
    case 'basic':
      return <BasicGuide {...props} />;
    case 'controlled':
      return <ControlledGuide {...props} />;
    case 'store':
      return <StoreGuide {...props} />;
  }
}
