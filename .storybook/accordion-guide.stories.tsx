import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Accordion, Avatar, Badge, Text } from '../src';

/** Put a custom decorative icon before the item label. */
function IconItem(): JSX.Element {
  return (
    <Accordion.Item value="icon">
      <Accordion.ItemTrigger data-testid="accordion-icon-trigger">
        <svg aria-hidden="true" viewBox="0 0 16 16" width="20" height="20">
          <path d="M2 3h12v10H2z" fill="currentColor" />
        </svg>
        Product details
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>Custom icon panel</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

/** Compose an Avatar and Badge inside an item trigger. */
function AvatarItem(): JSX.Element {
  return (
    <Accordion.Item value="avatar">
      <Accordion.ItemTrigger data-testid="accordion-avatar-trigger">
        <Avatar.Root shape="rounded" size="sm">
          <Avatar.Fallback name="Ada Lovelace" />
        </Avatar.Root>
        <span style={{ flex: 1 }}>Ada Lovelace</span>
        <Badge colorPalette="green">Top Rated</Badge>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>Ada wrote the first computer program.</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

/** Keep a secondary description in the accessible trigger label. */
function SubtextItem(): JSX.Element {
  return (
    <Accordion.Item value="subtext">
      <Accordion.ItemTrigger data-testid="accordion-subtext-trigger">
        <span>
          <Text>Shipping details</Text>
          <Text
            style={{
              'font-size': 'var(--lui-font-sizes-sm)',
              color: 'var(--lui-colors-fg-muted)',
            }}
          >
            Click to expand
          </Text>
        </span>
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>Ships in two days.</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

/** Exercise icon, avatar, badge, and subtext guide compositions together. */
function AccordionGuideStory(): JSX.Element {
  return (
    <>
      <div style={{ width: '400px', padding: '24px' }}>
        <Accordion.Root collapsible defaultValue={['avatar']}>
          <IconItem />
          <AvatarItem />
          <SubtextItem />
        </Accordion.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Accordion Guide',
  component: AccordionGuideStory,
} satisfies Meta<typeof AccordionGuideStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compositions: Story = { render: AccordionGuideStory };
