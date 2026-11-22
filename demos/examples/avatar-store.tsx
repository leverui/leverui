import { type JSX } from '@solidjs/web';
import { Avatar, Code, Stack, useAvatar } from '../../src';

/** Show a caller-owned Avatar machine and its image load state. */
export function AvatarWithStore(): JSX.Element {
  const avatar = useAvatar();
  return (
    <Stack align="flex-start">
      <Avatar.RootProvider value={avatar}>
        <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
        <Avatar.Fallback name="Mara Ellison" />
      </Avatar.RootProvider>
      <Code>{avatar().loaded ? 'loaded' : 'not loaded'}</Code>
    </Stack>
  );
}
