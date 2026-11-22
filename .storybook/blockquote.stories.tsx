import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Blockquote } from '../src';

const variants = ['subtle', 'solid', 'plain'] as const;
const justifications = ['start', 'center', 'end'] as const;

/** Show each variant, justification, and composition example. */
function BlockquoteMatrix(): JSX.Element {
  const [centered, setCentered] = createSignal(false);

  /** Change the inherited justification on existing figures. */
  function toggleJustification(): void {
    setCentered(!centered());
  }

  return (
    <>
      <div data-testid="blockquote-matrix">
        {variants.map(
          /** Render one color palette treatment with quote attribution. */
          (variant) => (
            <Blockquote.Root
              variant={variant}
              colorPalette="blue"
              data-testid={`blockquote-${variant}`}
            >
              <Blockquote.Icon data-testid={`blockquote-${variant}-icon`} />
              <Blockquote.Content cite="https://example.com">Quoted content</Blockquote.Content>
              <Blockquote.Caption>
                — <cite>Writer</cite>
              </Blockquote.Caption>
            </Blockquote.Root>
          ),
        )}
        {justifications.map(
          /** Render all three alignment modes with their native captions. */
          (justify) => (
            <Blockquote.Root justify={justify} data-testid={`blockquote-${justify}`}>
              <Blockquote.Content>Aligned {justify}</Blockquote.Content>
              <Blockquote.Caption>Caption</Blockquote.Caption>
            </Blockquote.Root>
          ),
        )}
        <Blockquote.PropsProvider
          value={{ justify: centered() ? 'center' : 'start', variant: 'solid' }}
        >
          <Blockquote.Root data-testid="blockquote-reactive">
            <Blockquote.Content>Changing alignment</Blockquote.Content>
          </Blockquote.Root>
          <Blockquote.Root justify="end" data-testid="blockquote-fixed">
            <Blockquote.Content>Fixed alignment</Blockquote.Content>
          </Blockquote.Root>
        </Blockquote.PropsProvider>
        <Blockquote.Root unstyled data-testid="blockquote-unstyled">
          <Blockquote.Content>Plain semantic quote</Blockquote.Content>
        </Blockquote.Root>
        <button type="button" data-testid="blockquote-toggle" onClick={toggleJustification}>
          Toggle alignment
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Blockquote',
  component: BlockquoteMatrix,
} satisfies Meta<typeof BlockquoteMatrix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
