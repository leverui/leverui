import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Select } from '../src';

const collection = Select.createListCollection({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
  ],
});

/** Render the same options under either Select machine owner. */
function Options(): JSX.Element {
  return (
    <For each={collection.items}>
      {
        /** Keep each option associated with its collection item. */
        (item) => (
          <Select.Item item={item}>
            <Select.ItemText>{item.label}</Select.ItemText>
          </Select.Item>
        )
      }
    </For>
  );
}

/** Show reactive inherited CSS choices on an owned and an external machine. */
function ProviderExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const external = Select.useSelect({
    id: 'provider-select-external',
    collection,
    name: 'external',
    defaultValue: ['react'],
  });

  /** Change inherited appearance without replacing either machine. */
  function toggleAppearance(): void {
    setLarge(!large());
  }

  /** Supply current size and variant to both nested roots. */
  function inheritedProps() {
    return {
      size: large() ? ('lg' as const) : ('xs' as const),
      variant: large() ? ('ghost' as const) : ('outline' as const),
    };
  }

  return (
    <Select.PropsProvider value={inheritedProps}>
      <form data-testid="select-providers-form" style={{ padding: '24px', width: '360px' }}>
        <Select.Root
          collection={collection}
          name="owned"
          defaultValue={['solid']}
          data-testid="select-owned-root"
        >
          <Select.HiddenSelect />
          <Select.Label>Owned framework</Select.Label>
          <Select.Control>
            <Select.Trigger data-testid="select-owned-trigger">
              <Select.ValueText />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              <Select.List>
                <Options />
              </Select.List>
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
        <Select.RootProvider value={external} data-testid="select-external-root">
          <Select.HiddenSelect />
          <Select.Label>External framework</Select.Label>
          <Select.Control>
            <Select.Trigger data-testid="select-external-trigger">
              <Select.ValueText />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              <Select.List>
                <Options />
              </Select.List>
            </Select.Content>
          </Select.Positioner>
        </Select.RootProvider>
        <button type="button" onClick={toggleAppearance}>
          Toggle inherited appearance
        </button>
      </form>
    </Select.PropsProvider>
  );
}

/** Keep the appearance provider above machine-owned and external roots. */
function SelectProvidersStory(): JSX.Element {
  return (
    <>
      <ProviderExample />
    </>
  );
}

const meta = {
  title: 'Components/Select Providers',
  component: SelectProvidersStory,
} satisfies Meta<typeof SelectProvidersStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
