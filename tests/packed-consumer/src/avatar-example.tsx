import { Avatar, AvatarGroup } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Mark the selected native group element through its public ref. */
function markGroup(element: HTMLElement): void {
  element.dataset.avatarGroupRef = 'section';
}

/** Exercise installed Avatar parts, variants, and reactive fallback content. */
export function PackedAvatar(): JSX.Element {
  const [name, setName] = createSignal('Ada Lovelace');

  /** Change fallback initials in the installed consumer. */
  function changeName(): void {
    setName('Grace Hopper');
  }

  return (
    <>
      <Avatar.Root
        id="packed-avatar-machine"
        size="lg"
        variant="solid"
        colorPalette="blue"
        class="packed-avatar-custom"
      >
        <Avatar.Fallback name={name()} />
      </Avatar.Root>
      <AvatarGroup as="section" ref={markGroup} size="xs" id="packed-avatar-group">
        <Avatar.Root>
          <Avatar.Fallback name="First Person" />
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback name="Last Person" />
        </Avatar.Root>
      </AvatarGroup>
      <button id="packed-avatar-change" type="button" onClick={changeName}>
        Change Avatar
      </button>
    </>
  );
}
