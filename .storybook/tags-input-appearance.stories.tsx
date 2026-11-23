import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TagsInput } from '../src';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['outline', 'subtle', 'flushed'] as const;
const matrix = sizes.flatMap(
  /** Pair each size with every visual variant. */
  (size) =>
    variants.map(
      /** Keep the matrix stable for browser and visual checks. */
      (variant) => ({ size, variant }),
    ),
);

/** Display every CSS appearance combination and an unlayered consumer override. */
function TagsInputAppearanceExample(): JSX.Element {
  return (
    <>
      <style>
        {'.tags-input-consumer .lui-tags-input__control { background: rgb(1, 99, 222); }'}
      </style>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <For each={matrix}>
          {
            /** Render one CSS size and variant pair. */
            ({ size, variant }) => (
              <TagsInput.Root
                size={size}
                variant={variant}
                defaultValue={['Solid']}
                data-testid={`tags-input-matrix-${size}-${variant}`}
              >
                <TagsInput.Label>{`${size} ${variant}`}</TagsInput.Label>
                <TagsInput.Control>
                  <TagsInput.Items />
                  <TagsInput.Input />
                </TagsInput.Control>
              </TagsInput.Root>
            )
          }
        </For>
        <TagsInput.Root class="tags-input-consumer" data-testid="tags-input-consumer-root">
          <TagsInput.Label>Consumer override</TagsInput.Label>
          <TagsInput.Control data-testid="tags-input-css-override-control">
            <TagsInput.Input />
          </TagsInput.Control>
        </TagsInput.Root>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tags Input Appearance',
  component: TagsInputAppearanceExample,
} satisfies Meta<typeof TagsInputAppearanceExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Matrix: Story = { render: TagsInputAppearanceExample };
