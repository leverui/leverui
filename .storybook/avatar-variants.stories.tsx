import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Avatar, AvatarGroup } from '../src';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/** Show every stock Avatar size, shape, and surface choice. */
function AvatarVariantsExample(): JSX.Element {
  return (
    <>
      <div data-testid="avatar-size-matrix">
        <For each={sizes}>
          {
            /** Keep each size's fallback inside its own primitive machine. */
            (size) => (
              <Avatar.Root size={size} data-testid={`avatar-size-${size}`}>
                <Avatar.Fallback name="Ada Lovelace" />
              </Avatar.Root>
            )
          }
        </For>
        <div style={{ width: '80px' }}>
          <Avatar.Root size="full" data-testid="avatar-size-full">
            <Avatar.Fallback name="Ada Lovelace" />
          </Avatar.Root>
        </div>
      </div>
      <div data-testid="avatar-shape-matrix">
        <Avatar.Root shape="square" data-testid="avatar-shape-square">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
        <Avatar.Root shape="rounded" data-testid="avatar-shape-rounded">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
        <Avatar.Root shape="full" data-testid="avatar-shape-full">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
      </div>
      <div data-testid="avatar-variant-matrix">
        <Avatar.Root variant="solid" colorPalette="blue" data-testid="avatar-variant-solid">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
        <Avatar.Root variant="subtle" colorPalette="blue" data-testid="avatar-variant-subtle">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
        <Avatar.Root variant="outline" colorPalette="blue" data-testid="avatar-variant-outline">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
      </div>
      <AvatarGroup data-testid="avatar-bordered-group">
        <Avatar.Root data-testid="avatar-bordered-first">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
        <Avatar.Root data-testid="avatar-bordered-last">
          <Avatar.Fallback name="B" />
        </Avatar.Root>
      </AvatarGroup>
      <AvatarGroup borderless data-testid="avatar-borderless-group">
        <Avatar.Root data-testid="avatar-borderless-first">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
        <Avatar.Root data-testid="avatar-borderless-last">
          <Avatar.Fallback name="B" />
        </Avatar.Root>
      </AvatarGroup>
      <AvatarGroup
        borderless={{ base: true, md: false }}
        data-testid="avatar-responsive-border-group"
      >
        <Avatar.Root data-testid="avatar-responsive-border-first">
          <Avatar.Fallback name="A" />
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback name="B" />
        </Avatar.Root>
      </AvatarGroup>
      <Avatar.Root size={{ base: 'sm', md: 'lg' }} data-testid="avatar-responsive">
        <Avatar.Fallback name="A" />
      </Avatar.Root>
      <Avatar.Root
        variant={{ base: 'solid', md: 'outline' }}
        shape={{ base: 'square', md: 'rounded' }}
        colorPalette="blue"
        data-testid="avatar-responsive-treatment"
      >
        <Avatar.Fallback name="A" />
      </Avatar.Root>
      <Avatar.Root unstyled class="consumer-avatar" data-testid="avatar-unstyled">
        <Avatar.Fallback name="A" />
      </Avatar.Root>
    </>
  );
}

const meta = {
  title: 'Content/Avatar Variants',
  component: AvatarVariantsExample,
} satisfies Meta<typeof AvatarVariantsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
