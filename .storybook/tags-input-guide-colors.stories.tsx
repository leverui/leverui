import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TagsInput } from '../src';
import { tagsInputGuideColor } from '../demos/tags-input-guide-color';
import '../demos/tags-input-examples.css';

/** Preserve the guide's custom tag colors as machine values change. */
function ColoredTagsInput(): JSX.Element {
  return (
    <>
      <div style={{ padding: '24px', width: '360px' }}>
        <TagsInput.Root defaultValue={['SolidJS', 'Lever UI', 'TypeScript']} name="colored-tags">
          <TagsInput.Label>Colored tags</TagsInput.Label>
          <TagsInput.Control data-testid="tags-guide-colors-control">
            <TagsInput.Context>
              {
                /** Render each live value with the guide's color. */
                (api) => (
                  <For keyed={false} each={api().value}>
                    {
                      /** Keep duplicate values distinct by their machine index. */
                      (tag, index) => (
                        <TagsInput.Item index={index} value={tag()}>
                          <TagsInput.ItemPreview
                            class="tags-input-colored-preview"
                            style={{ 'background-color': tagsInputGuideColor(tag()) }}
                          >
                            <TagsInput.ItemText>{tag()}</TagsInput.ItemText>
                            <TagsInput.ItemDeleteTrigger />
                          </TagsInput.ItemPreview>
                          <TagsInput.ItemInput />
                        </TagsInput.Item>
                      )
                    }
                  </For>
                )
              }
            </TagsInput.Context>
            <TagsInput.Input placeholder="Add colored tag" />
            <TagsInput.ClearTrigger aria-label="Clear colored tags" />
          </TagsInput.Control>
          <TagsInput.HiddenInput />
        </TagsInput.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tags Input Guide Colors',
  component: ColoredTagsInput,
} satisfies Meta<typeof ColoredTagsInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: ColoredTagsInput };
