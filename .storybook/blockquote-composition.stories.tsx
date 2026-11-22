import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Avatar, Blockquote, Float } from '../src';

/** Compose a custom icon, floating placement, and author Avatar. */
function BlockquoteComposition(): JSX.Element {
  return (
    <>
      <Blockquote.Root variant="plain" colorPalette="blue" data-testid="blockquote-composed">
        <Float placement="top-start" offsetY="2" data-testid="blockquote-float">
          <Blockquote.Icon
            aria-label="Custom quotation symbol"
            data-testid="blockquote-custom-icon"
          >
            <circle cx="12" cy="12" r="8" />
          </Blockquote.Icon>
        </Float>
        <Blockquote.Content
          cite="https://example.com/quote"
          data-testid="blockquote-composed-content"
        >
          A composable quotation.
        </Blockquote.Content>
        <Blockquote.Caption data-testid="blockquote-composed-caption">
          <cite>
            <Avatar.Root size="sm" data-testid="blockquote-author-avatar">
              <Avatar.Fallback name="Ada Lovelace" />
            </Avatar.Root>
            Ada Lovelace
          </cite>
        </Blockquote.Caption>
      </Blockquote.Root>
    </>
  );
}

const meta = {
  title: 'Content/Blockquote Composition',
  component: BlockquoteComposition,
} satisfies Meta<typeof BlockquoteComposition>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guide: Story = {};
