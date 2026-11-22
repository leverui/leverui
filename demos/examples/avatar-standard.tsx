import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, HStack, Stack, Text } from '../../src';
import { avatarPersonas } from './avatar-data';

/** Show a named Avatar with the portrait URL. */
export function AvatarBasic(): JSX.Element {
  return (
    <Avatar.Root>
      <Avatar.Fallback name="Mara Ellison" />
      <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
    </Avatar.Root>
  );
}

/** Display each persona's portrait, name, and email address. */
export function AvatarPersona(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={avatarPersonas}>
        {/** Render one fixed persona without deriving new state. */}
        {(user) => (
          <HStack gap="4">
            <Avatar.Root>
              <Avatar.Fallback name={user.name} />
              <Avatar.Image src={user.avatar} />
            </Avatar.Root>
            <Stack gap="0">
              <Text style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>
                {user.name}
              </Text>
              <Text
                textStyle="sm"
                style={{
                  color: 'var(--leverui-colors-fg-muted)',
                }}
              >
                {user.email}
              </Text>
            </Stack>
          </HStack>
        )}
      </For>
    </Stack>
  );
}

/** Show fallback initials and the generic fallback for broken images. */
export function AvatarWithFallback(): JSX.Element {
  return (
    <HStack>
      <Avatar.Root>
        <Avatar.Fallback name="Corin Vale" />
        <Avatar.Image src="https://example.com/missing-avatar.png" />
      </Avatar.Root>
      <Avatar.Root colorPalette="teal">
        <Avatar.Fallback name="Wren Ashford" />
        <Avatar.Image src="https://example.com/missing-avatar.png" />
      </Avatar.Root>
      <Avatar.Root colorPalette="red">
        <Avatar.Fallback />
        <Avatar.Image src="https://example.com/missing-avatar.png" />
      </Avatar.Root>
    </HStack>
  );
}

/** Compare square, rounded, and circular Avatar shapes. */
export function AvatarWithShape(): JSX.Element {
  return (
    <HStack gap="4">
      <Avatar.Root shape="square" size="lg">
        <Avatar.Fallback name="Iris Calder" />
        <Avatar.Image src="/demo-images/avatars/avatar-3.webp" />
      </Avatar.Root>
      <Avatar.Root shape="rounded" size="lg">
        <Avatar.Fallback name="Mara Ellison" />
        <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
      </Avatar.Root>
      <Avatar.Root shape="full" size="lg">
        <Avatar.Fallback name="Vesna Kral" />
        <Avatar.Image src="/demo-images/avatars/avatar-5.webp" />
      </Avatar.Root>
    </HStack>
  );
}
