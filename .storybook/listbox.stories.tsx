import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Listbox, createListCollection, useListCollection } from '../src';
import './listbox-css-contract.css';

const react = { label: 'React', value: 'react' };
const frameworks = [
  react,
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue', disabled: true },
  { label: 'Svelte', value: 'svelte' },
];

/** Exercise Listbox selection, filtering, orientation, and live appearance. */
function ListboxContractExample(): JSX.Element {
  const [solidVariant, setSolidVariant] = createSignal(false);
  const [horizontal, setHorizontal] = createSignal(false);
  const [selected, setSelected] = createSignal<string[]>([]);
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    /** Match the displayed option label regardless of case. */
    filter: (text, query) => text.toLowerCase().includes(query.toLowerCase()),
  });

  /** Keep the visible collection tied to the native filter input. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    filter(event.currentTarget.value);
  }

  /** Show the machine value for browser contract checks. */
  function handleValueChange(details: { value: string[] }): void {
    setSelected(details.value);
  }

  /** Change appearance without replacing the machine or its option nodes. */
  function toggleVariant(): void {
    setSolidVariant(!solidVariant());
  }

  /** Change the same collection's navigation orientation. */
  function toggleOrientation(): void {
    setHorizontal(!horizontal());
  }

  return (
    <>
      <div style={{ width: '400px', padding: '24px' }}>
        <Listbox.Root
          collection={collection()}
          variant={solidVariant() ? 'solid' : 'subtle'}
          orientation={horizontal() ? 'horizontal' : 'vertical'}
          onValueChange={handleValueChange}
          data-testid="listbox-root"
        >
          <Listbox.Label>
            Frameworks: <Listbox.ValueText placeholder="Choose one" />
          </Listbox.Label>
          <Listbox.Input
            aria-label="Filter frameworks"
            placeholder="Filter frameworks"
            onInput={handleInput}
            data-testid="listbox-input"
          />
          <Listbox.Content data-testid="listbox-content">
            <Listbox.Empty>No matching frameworks</Listbox.Empty>
            <Listbox.List>
              <Listbox.ItemGroup>
                <Listbox.ItemGroupLabel>Popular frameworks</Listbox.ItemGroupLabel>
                <For each={collection().items}>
                  {
                    /** Render every item from the current primitive collection. */
                    (item) => (
                      <Listbox.Item item={item} data-testid={`item-${item.value}`}>
                        <Listbox.ItemText>{item.label}</Listbox.ItemText>
                        <Listbox.ItemIndicator />
                      </Listbox.Item>
                    )
                  }
                </For>
              </Listbox.ItemGroup>
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
        <output data-testid="listbox-selected">{selected().join(',')}</output>
        <button type="button" onClick={toggleVariant} data-testid="toggle-listbox-variant">
          Toggle variant
        </button>
        <button type="button" onClick={toggleOrientation} data-testid="toggle-listbox-orientation">
          Toggle orientation
        </button>
      </div>
    </>
  );
}

/** Show a responsive CSS switch while keeping one Listbox machine. */
function ListboxResponsiveExample(): JSX.Element {
  const collection = createListCollection({ items: frameworks });

  return (
    <>
      <Listbox.Root
        collection={collection}
        variant={{ base: 'plain', md: 'solid' }}
        data-testid="listbox-responsive-root"
      >
        <Listbox.Label>Responsive frameworks</Listbox.Label>
        <Listbox.Content data-testid="listbox-responsive-content">
          <Listbox.List>
            <For each={collection.items}>
              {
                /** Keep each visible option tied to the machine collection. */
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
    </>
  );
}

/** Exercise consumer hooks, native styles, and the unstyled escape hatch. */
function ListboxCssContractExample(): JSX.Element {
  const collection = createListCollection({ items: frameworks });

  return (
    <>
      <Listbox.Root
        collection={collection}
        defaultValue={['solid']}
        class="consumer-listbox"
        style={{ width: '280px', '--leverui-listbox-selected-background': 'rgb(253, 230, 138)' }}
        data-testid="listbox-css-root"
      >
        <Listbox.Label>Styled frameworks</Listbox.Label>
        <Listbox.Content class="consumer-listbox-content" data-testid="listbox-css-content">
          <Listbox.List>
            <For each={collection.items}>
              {
                /** Retain native option and selection behavior under consumer CSS. */
                (item) => (
                  <Listbox.Item item={item} class="consumer-listbox-item">
                    <Listbox.ItemText>{item.label}</Listbox.ItemText>
                    <Listbox.ItemIndicator />
                  </Listbox.Item>
                )
              }
            </For>
          </Listbox.List>
        </Listbox.Content>
      </Listbox.Root>
      <Listbox.Root collection={collection} unstyled data-testid="listbox-unstyled-root">
        <Listbox.Label>Plain frameworks</Listbox.Label>
        <Listbox.Content data-testid="listbox-unstyled-content">
          <Listbox.List>
            <Listbox.Item item={react} data-testid="listbox-unstyled-item">
              <Listbox.ItemText>React</Listbox.ItemText>
            </Listbox.Item>
          </Listbox.List>
        </Listbox.Content>
      </Listbox.Root>
    </>
  );
}

const meta = {
  title: 'Components/Listbox',
  component: ListboxContractExample,
} satisfies Meta<typeof ListboxContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
export const Responsive: Story = { render: ListboxResponsiveExample };
export const CssContract: Story = { render: ListboxCssContractExample };
