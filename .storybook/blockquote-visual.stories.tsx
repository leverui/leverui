import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Blockquote, Theme } from '../src';

/** Show Blockquote palette, scope, logical direction, and reactive states. */
function BlockquoteVisualStates(): JSX.Element {
  const [alternate, setAlternate] = createSignal(false);

  /** Change the mounted figure from subtle blue to solid green. */
  function toggleAppearance(): void {
    setAlternate(!alternate());
  }

  return (
    <>
      <div data-testid="blockquote-visual-states">
        <Blockquote.Root data-testid="blockquote-default">
          <Blockquote.Icon data-testid="blockquote-default-icon" />
          <Blockquote.Content>Default quotation</Blockquote.Content>
          <Blockquote.Caption data-testid="blockquote-default-caption">
            Default author
          </Blockquote.Caption>
        </Blockquote.Root>
        <Blockquote.Root variant="subtle" colorPalette="blue" data-testid="blockquote-blue-subtle">
          <Blockquote.Icon data-testid="blockquote-blue-subtle-icon" />
          <Blockquote.Content>Blue subtle</Blockquote.Content>
          <Blockquote.Caption data-testid="blockquote-blue-caption">Blue author</Blockquote.Caption>
        </Blockquote.Root>
        <Blockquote.Root variant="solid" colorPalette="blue" data-testid="blockquote-blue-solid">
          <Blockquote.Icon data-testid="blockquote-blue-solid-icon" />
          <Blockquote.Content>Blue solid</Blockquote.Content>
        </Blockquote.Root>
        <Blockquote.Root variant="plain" colorPalette="blue" data-testid="blockquote-blue-plain">
          <Blockquote.Icon data-testid="blockquote-blue-plain-icon" />
          <Blockquote.Content>Blue plain</Blockquote.Content>
        </Blockquote.Root>
        <Blockquote.Root
          variant={alternate() ? 'solid' : 'subtle'}
          colorPalette={alternate() ? 'green' : 'blue'}
          data-testid="blockquote-reactive-appearance"
        >
          <Blockquote.Icon data-testid="blockquote-reactive-appearance-icon" />
          <Blockquote.Content>Changing appearance</Blockquote.Content>
        </Blockquote.Root>
        <Blockquote.Root justify={{ base: 'start', md: 'end' }} data-testid="blockquote-responsive">
          <Blockquote.Content>Responsive quote</Blockquote.Content>
        </Blockquote.Root>
        <Blockquote.Root
          variant={{ base: 'subtle', md: 'plain', lg: 'solid' }}
          colorPalette="blue"
          data-testid="blockquote-responsive-variant"
        >
          <Blockquote.Icon data-testid="blockquote-responsive-variant-icon" />
          <Blockquote.Content>Responsive treatment</Blockquote.Content>
        </Blockquote.Root>
        <Theme appearance="dark" hasBackground={false} data-testid="blockquote-dark-scope">
          <Blockquote.Root colorPalette="blue" data-testid="blockquote-dark-subtle">
            <Blockquote.Icon data-testid="blockquote-dark-icon" />
            <Blockquote.Content>Dark quote</Blockquote.Content>
            <Blockquote.Caption data-testid="blockquote-dark-caption">
              Dark author
            </Blockquote.Caption>
          </Blockquote.Root>
          <Theme appearance="light" hasBackground={false} data-testid="blockquote-light-scope">
            <Blockquote.Root colorPalette="blue" data-testid="blockquote-light-subtle">
              <Blockquote.Icon data-testid="blockquote-light-icon" />
              <Blockquote.Content>Light quote</Blockquote.Content>
            </Blockquote.Root>
          </Theme>
        </Theme>
        <Blockquote.Root colorPalette="blue" data-testid="blockquote-css-override">
          <Blockquote.Icon data-testid="blockquote-css-override-icon" />
          <Blockquote.Content>Consumer themed quote</Blockquote.Content>
        </Blockquote.Root>
        <div dir="rtl">
          <Blockquote.Root variant="solid" colorPalette="blue" data-testid="blockquote-rtl">
            <Blockquote.Content>Right to left quote</Blockquote.Content>
          </Blockquote.Root>
        </div>
        <Blockquote.Root variant="solid" colorPalette="blue" data-testid="blockquote-part-unstyled">
          <Blockquote.Icon unstyled data-testid="blockquote-icon-unstyled" />
          <Blockquote.Content>Part styles removed</Blockquote.Content>
          <Blockquote.Caption unstyled data-testid="blockquote-caption-unstyled">
            Plain caption
          </Blockquote.Caption>
        </Blockquote.Root>
        <Blockquote.Root colorPalette="blue" data-testid="blockquote-outer">
          <Blockquote.Caption data-testid="blockquote-outer-caption">
            Outer caption
          </Blockquote.Caption>
          <Blockquote.Root unstyled data-testid="blockquote-nested-unstyled">
            <Blockquote.Icon data-testid="blockquote-nested-icon" />
            <Blockquote.Caption data-testid="blockquote-nested-caption">
              Inner caption
            </Blockquote.Caption>
          </Blockquote.Root>
        </Blockquote.Root>
        <button type="button" data-testid="blockquote-appearance-toggle" onClick={toggleAppearance}>
          Toggle appearance
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Content/Blockquote Visual',
  component: BlockquoteVisualStates,
} satisfies Meta<typeof BlockquoteVisualStates>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {};
