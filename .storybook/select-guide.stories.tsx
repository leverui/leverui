import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Portal, Select, Span } from '../src';

interface GuideItem {
  label: string;
  value: string;
  description?: string;
}

const grouped = Select.createListCollection({
  items: [
    { label: 'Lanternwright', value: 'lanternwright', category: 'Books' },
    { label: 'Saltwind', value: 'saltwind', category: 'Books' },
    { label: 'Midnight Ferry', value: 'midnight-ferry', category: 'Movies' },
  ],
});
const plans = Select.createListCollection({
  items: [
    { label: 'Basic Plan', value: 'basic', description: '$9/month - Small projects' },
    { label: 'Pro Plan', value: 'pro', description: '$29/month - Advanced features' },
  ],
});
const overflow = Select.createListCollection({
  items: Array.from(
    { length: 20 },
    /** Keep the final option outside the initial popup viewport. */
    (_, index) => ({ label: `Movie ${index + 1}`, value: `movie-${index + 1}` }),
  ),
});

/** Reuse the public trigger composition across guide collections. */
function GuideTrigger(props: { placeholder: string; testId: string }): JSX.Element {
  return (
    <Select.Control>
      <Select.Trigger data-testid={props.testId}>
        <Select.ValueText placeholder={props.placeholder} />
      </Select.Trigger>
      <Select.IndicatorGroup>
        <Select.Indicator />
      </Select.IndicatorGroup>
    </Select.Control>
  );
}

/** Keep an option's description and selection icon within its collection item. */
function GuideOption(props: { item: GuideItem }): JSX.Element {
  return (
    <Select.Item item={props.item}>
      <div>
        <Select.ItemText>{props.item.label}</Select.ItemText>
        {props.item.description && (
          <Span
            textStyle="xs"
            style={{
              color: 'var(--leverui-colors-fg-muted)',
            }}
          >
            {props.item.description}
          </Span>
        )}
      </div>
      <Select.ItemIndicator />
    </Select.Item>
  );
}

/** Exercise grouped, described, and overflowed option compositions. */
function SelectGuideExample(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '24px', width: '320px', padding: '24px' }}>
        <Select.Root collection={grouped} size="sm">
          <Select.Label>Grouped media</Select.Label>
          <GuideTrigger placeholder="Choose media" testId="select-grouped-trigger" />
          <Portal>
            <Select.Positioner>
              <Select.Content data-testid="select-grouped-content">
                <Select.List>
                  <For each={['Books', 'Movies']}>
                    {
                      /** Keep each heading above only its matching options. */
                      (category) => (
                        <Select.ItemGroup>
                          <Select.ItemGroupLabel>{category}</Select.ItemGroupLabel>
                          <For each={grouped.items.filter((item) => item.category === category)}>
                            {
                              /** Render each grouped collection option. */
                              (item) => <GuideOption item={item} />
                            }
                          </For>
                        </Select.ItemGroup>
                      )
                    }
                  </For>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Select.Root collection={plans} size="sm" defaultValue={['pro']}>
          <Select.Label>Described plan</Select.Label>
          <GuideTrigger placeholder="Choose plan" testId="select-described-trigger" />
          <Portal>
            <Select.Positioner>
              <Select.Content data-testid="select-described-content">
                <Select.List>
                  <For each={plans.items}>
                    {
                      /** Keep each plan's description with its option. */
                      (item) => <GuideOption item={item} />
                    }
                  </For>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Select.Root collection={overflow} size="sm" style={{ width: '240px' }}>
          <Select.Label>Overflow movies</Select.Label>
          <GuideTrigger placeholder="Choose movie" testId="select-overflow-trigger" />
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.List data-testid="select-overflow-content">
                  <For each={overflow.items}>
                    {
                      /** Render enough options to require vertical scrolling. */
                      (item) => <GuideOption item={item} />
                    }
                  </For>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Select Guide',
  component: SelectGuideExample,
} satisfies Meta<typeof SelectGuideExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: SelectGuideExample };
