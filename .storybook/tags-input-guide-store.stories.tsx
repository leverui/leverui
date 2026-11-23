import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, Stack, TagsInput } from '../src';

/** Show a caller-owned machine changing Tags Input outside its root. */
function TagsInputGuideStore(): JSX.Element {
  const tags = TagsInput.useTagsInput({ defaultValue: ['SolidJS', 'Lever UI'] });

  /** Clear the machine from outside the compound root. */
  function clearTags(): void {
    tags().clearValue();
  }

  return (
    <>
      <Stack align="flex-start" gap="4" style={{ padding: 'var(--lui-spacing-6)', width: '360px' }}>
        <TagsInput.RootProvider value={tags}>
          <TagsInput.Label>Tags</TagsInput.Label>
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Add stored tag" />
          </TagsInput.Control>
        </TagsInput.RootProvider>
        <output data-testid="tags-guide-store-value">{JSON.stringify(tags().value)}</output>
        <Button type="button" variant="outline" size="sm" onClick={clearTags}>
          Clear all stored tags
        </Button>
      </Stack>
    </>
  );
}

const meta = {
  title: 'Components/Tags Input Guide Store',
  component: TagsInputGuideStore,
} satisfies Meta<typeof TagsInputGuideStore>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: TagsInputGuideStore };
