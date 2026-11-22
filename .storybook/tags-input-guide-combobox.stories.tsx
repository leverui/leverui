import { createUniqueId } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Combobox, TagsInput, useFilter, useListCollection } from '../src';
import { TagsInputGuideComboboxExample } from './tags-input-guide-combobox-example';

/** Show the shared-input guide with locally generated machine IDs. */
function TagsInputGuideComboboxStory(): JSX.Element {
  const id = createUniqueId();
  const ids = {
    label: `tags-combobox-label-${id}`,
    input: `tags-combobox-input-${id}`,
    control: `tags-combobox-control-${id}`,
  };

  return (
    <>
      <div style={{ padding: '24px', width: '360px', 'min-height': '340px' }}>
        <TagsInputGuideComboboxExample
          components={{ Combobox, TagsInput, useFilter, useListCollection }}
          ids={ids}
          initialTags={[]}
          label="Tags"
          testIds={{
            root: 'tags-guide-combobox-root',
            control: 'tags-guide-combobox-control',
            content: 'tags-guide-combobox-content',
            suggestionPrefix: 'suggestion',
          }}
        />
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tags Input Guide Combobox',
  component: TagsInputGuideComboboxStory,
} satisfies Meta<typeof TagsInputGuideComboboxStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: TagsInputGuideComboboxStory };
