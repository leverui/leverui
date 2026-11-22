import { createMemo, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Avatar, Select } from '../src';

/** Keep guide avatar images available without a network request. */
function avatarUrl(initials: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="${color}"/><text x="20" y="25" text-anchor="middle" fill="white" font-size="13" font-family="sans-serif">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const members = [
  { id: 'jessica_jones', name: 'Jessica Jones', avatar: avatarUrl('JJ', '#5651a6') },
  { id: 'kenneth_johnson', name: 'Kenneth Johnson', avatar: avatarUrl('KJ', '#137980') },
  { id: 'kate_wilson', name: 'Kate Wilson', avatar: avatarUrl('KW', '#a04575') },
];
const collection = Select.createListCollection({
  items: members,
  itemToString:
    /** Give the selected avatar its readable member name. */
    (item) => item.name,
  itemToValue:
    /** Keep the stable member ID as the native form value. */
    (item) => item.id,
});

/** Show the selected member's avatar and name in the trigger. */
function MemberValue(): JSX.Element {
  const select = Select.useSelectContext();
  const member = createMemo(
    /** Resolve the current machine value to its collection item. */
    () =>
      members.find(
        /** Match the machine's selected ID without duplicating state. */
        (candidate) => candidate.id === select().value[0],
      ),
  );
  return (
    <Select.ValueText placeholder="Select member">
      <Show when={member()} fallback="Select member">
        {
          /** Keep both selected text and avatar reactive. */
          (selected) => (
            <span style={{ display: 'inline-flex', 'align-items': 'center', gap: '8px' }}>
              <Avatar.Root shape="rounded" size="2xs">
                <Avatar.Image src={selected().avatar} alt={selected().name} />
                <Avatar.Fallback name={selected().name} />
              </Avatar.Root>
              {selected().name}
            </span>
          )
        }
      </Show>
    </Select.ValueText>
  );
}

/** Compose Select's selected item and popup options with Lever UI Avatar. */
function AvatarSelectGuide(): JSX.Element {
  return (
    <>
      <form data-testid="avatar-select-form" style={{ width: '280px', padding: '24px' }}>
        <Select.Root
          collection={collection}
          name="member"
          size="sm"
          defaultValue={['jessica_jones']}
        >
          <Select.HiddenSelect />
          <Select.Label>Select member</Select.Label>
          <Select.Control>
            <Select.Trigger data-testid="avatar-select-trigger">
              <MemberValue />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              <Select.List>
                <For each={members}>
                  {
                    /** Keep each avatar inside its selectable option. */
                    (item) => (
                      <Select.Item item={item} style={{ 'justify-content': 'flex-start' }}>
                        <Avatar.Root shape="rounded" size="2xs">
                          <Avatar.Image src={item.avatar} alt={item.name} />
                          <Avatar.Fallback name={item.name} />
                        </Avatar.Root>
                        <Select.ItemText>{item.name}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    )
                  }
                </For>
              </Select.List>
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Select Guide Avatar',
  component: AvatarSelectGuide,
} satisfies Meta<typeof AvatarSelectGuide>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: AvatarSelectGuide };
