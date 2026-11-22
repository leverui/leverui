import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, HStack } from '../../src';
import './avatar-ring.css';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const variants = ['solid', 'outline', 'subtle'] as const;
const ringAvatars = [
  {
    colorPalette: 'pink',
    src: '/demo-images/avatars/avatar-1.webp',
  },
  {
    colorPalette: 'green',
    src: '/demo-images/avatars/avatar-3.webp',
  },
  {
    colorPalette: 'blue',
    src: '/demo-images/avatars/avatar-2.webp',
  },
] as const;

/** Compare every fixed Avatar size. */
export function AvatarWithSizes(): JSX.Element {
  return (
    <HStack gap="3">
      <For each={sizes}>
        {
          /** Render one portrait at each size. */
          (size) => (
            <Avatar.Root size={size}>
              <Avatar.Fallback name="Mara Ellison" />
              <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
            </Avatar.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Compare the Avatar variants with initials. */
export function AvatarWithVariants(): JSX.Element {
  return (
    <HStack gap="3">
      <For each={variants}>
        {
          /** Render one initials fallback for each variant. */
          (variant) => (
            <Avatar.Root variant={variant}>
              <Avatar.Fallback name="Mara Ellison" />
            </Avatar.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Add an outline ring to three portraits with authored CSS. */
export function AvatarWithRing(): JSX.Element {
  return (
    <HStack gap="4">
      <For each={ringAvatars}>
        {
          /** Render one ringed portrait in its palette. */
          (avatar) => (
            <Avatar.Root class="avatar-example-ring" colorPalette={avatar.colorPalette}>
              <Avatar.Fallback name="Random" />
              <Avatar.Image src={avatar.src} />
            </Avatar.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Show a loaded portrait beside a broken image for part inspection. */
export function AvatarExplorerDemo(): JSX.Element {
  return (
    <HStack gap="2">
      <Avatar.Root>
        <Avatar.Fallback name="Mara Ellison" />
        <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Fallback name="Mara Ellison" />
        <Avatar.Image src="https://example.com/missing-avatar.png" />
      </Avatar.Root>
    </HStack>
  );
}
