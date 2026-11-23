import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, AvatarGroup, Stack } from '../../src';
import { avatarGroupItems } from './avatar-data';

/** Compare both stack orders and the borderless Avatar group. */
export function AvatarGroupWithStacking(): JSX.Element {
  return (
    <Stack>
      <AvatarGroup size="lg" stacking="last-on-top">
        <For each={avatarGroupItems}>
          {
            /** Show one portrait and its fallback. */
            (item) => (
              <Avatar.Root>
                <Avatar.Fallback name={item.name} />
                <Avatar.Image src={item.src} />
              </Avatar.Root>
            )
          }
        </For>
        <Avatar.Root>
          <Avatar.Fallback>+3</Avatar.Fallback>
        </Avatar.Root>
      </AvatarGroup>
      <AvatarGroup size="lg" stacking="first-on-top">
        <For each={avatarGroupItems}>
          {
            /** Show one portrait and its fallback. */
            (item) => (
              <Avatar.Root>
                <Avatar.Fallback name={item.name} />
                <Avatar.Image src={item.src} />
              </Avatar.Root>
            )
          }
        </For>
        <Avatar.Root>
          <Avatar.Fallback>+3</Avatar.Fallback>
        </Avatar.Root>
      </AvatarGroup>
      <AvatarGroup
        size="lg"
        style={{ '--lui-avatar-group-overlap': 'var(--lui-spacing-1)' }}
        borderless
      >
        <For each={avatarGroupItems}>
          {
            /** Show one portrait and its fallback. */
            (item) => (
              <Avatar.Root>
                <Avatar.Fallback name={item.name} />
                <Avatar.Image src={item.src} />
              </Avatar.Root>
            )
          }
        </For>
        <Avatar.Root>
          <Avatar.Fallback>+3</Avatar.Fallback>
        </Avatar.Root>
      </AvatarGroup>
    </Stack>
  );
}

/** Show the overlapping portrait group and overflow marker. */
export function AvatarWithGroup(): JSX.Element {
  return (
    <AvatarGroup size="lg">
      <For each={avatarGroupItems}>
        {
          /** Show one portrait and its fallback. */
          (item) => (
            <Avatar.Root>
              <Avatar.Fallback name={item.name} />
              <Avatar.Image src={item.src} />
            </Avatar.Root>
          )
        }
      </For>
      <Avatar.Root variant="solid">
        <Avatar.Fallback>+3</Avatar.Fallback>
      </Avatar.Root>
    </AvatarGroup>
  );
}
