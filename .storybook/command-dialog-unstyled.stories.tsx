import { type JSX } from '@solidjs/web';
import { Command, Portal } from '../src';

/** Exercise the public unstyled Command dialog surface in a real primitive dialog. */
function UnstyledDialog(): JSX.Element {
  return (
    <Command.Dialog>
      <Command.DialogTrigger>Open unstyled Command</Command.DialogTrigger>
      <Portal>
        <Command.DialogBackdrop />
        <Command.DialogContent unstyled title="Unstyled Command">
          <p>Unstyled content</p>
        </Command.DialogContent>
      </Portal>
    </Command.Dialog>
  );
}

export default { title: 'Internal/Command Dialog CSS' };
export const Unstyled = { render: UnstyledDialog };
