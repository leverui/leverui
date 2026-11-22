import { type JSX } from '@solidjs/web';
import { UserIcon } from '@lucide/solid';
import { InputGroup, NativeSelect } from '../../src';

/** Add the user icon ahead of the native select. */
export function NativeSelectWithInputGroup(): JSX.Element {
  return (
    <NativeSelect.Root size="sm">
      <InputGroup startElement={<UserIcon />}>
        <NativeSelect.Field placeholder="Select role">
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </NativeSelect.Field>
      </InputGroup>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
