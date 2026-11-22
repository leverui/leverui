import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ActivityIcon } from '@lucide/solid';
import { Avatar, HStack, Tag } from '../../src';

/** Compare a plain tag with the closable tag. */
export function TagBasic(): JSX.Element {
  return (
    <HStack>
      <Tag.Root>
        <Tag.Label>Plain tag</Tag.Label>
      </Tag.Root>
      <Tag.Root>
        <Tag.Label>Closable tag</Tag.Label>
        <Tag.EndElement>
          <Tag.CloseTrigger />
        </Tag.EndElement>
      </Tag.Root>
    </HStack>
  );
}

/** Compare four tag sizes with profile images. */
export function TagWithAvatar(): JSX.Element {
  return (
    <HStack>
      <For each={['sm', 'md', 'lg', 'xl'] as const}>
        {
          /** Render one rounded tag with a full-size profile image and fallback. */
          (size) => (
            <Tag.Root size={size} style={{ 'border-radius': '9999px' }}>
              <Tag.StartElement>
                <Avatar.Root size="full">
                  <Avatar.Image src="/demo-images/avatars/avatar-3.webp" />
                  <Avatar.Fallback name="Iris Calder" />
                </Avatar.Root>
              </Tag.StartElement>
              <Tag.Label>Iris {size}</Tag.Label>
            </Tag.Root>
          )
        }
      </For>
    </HStack>
  );
}

/** Show close controls beside tagged labels, including a leading icon. */
export function TagWithClose(): JSX.Element {
  return (
    <HStack>
      <Tag.Root>
        <Tag.StartElement>
          <ActivityIcon />
        </Tag.StartElement>
        <Tag.Label>Fitness</Tag.Label>
        <Tag.EndElement>
          <Tag.CloseTrigger />
        </Tag.EndElement>
      </Tag.Root>
      <Tag.Root>
        <Tag.Label>Travel</Tag.Label>
        <Tag.EndElement>
          <Tag.CloseTrigger />
        </Tag.EndElement>
      </Tag.Root>
    </HStack>
  );
}

/** Truncate the long label inside a blue 200px tag. */
export function TagWithOverflow(): JSX.Element {
  return (
    <Tag.Root size="sm" colorPalette="blue" style={{ 'max-width': '200px' }}>
      <Tag.Label>
        This label is much too long to fit in a tag that is only 200 pixels wide, so the tag shows
        as much of the text as it can on one line and cuts off the rest
      </Tag.Label>
      <Tag.EndElement>
        <Tag.CloseTrigger />
      </Tag.EndElement>
    </Tag.Root>
  );
}
