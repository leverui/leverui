import { createRoot, flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import { useCommand } from './use-command';
import { useCommandCollection } from './use-command-collection';

/** Keep action, page, and modifier behavior aligned with the palette contract. */
function verifiesSelectionPolicy(): void {
  const actions: string[] = [];
  const items = [
    {
      value: 'settings',
      label: 'Settings',
      onSelect:
        /** Record item-level action ordering. */
        () => {
          actions.push('item');
        },
    },
    { value: 'status', label: 'Change status' },
    { value: 'done', label: 'Done', parent: 'status' },
  ];
  const owner = createRoot(
    /** Retain the Command machine and its Solid owner for this test. */
    (dispose) => {
      const command = useCommandCollection({ initialItems: items });
      const machine = useCommand({
        command,
        onSelect:
          /** Record the root callback after the item callback. */
          () => {
            actions.push('root');
          },
        onClose:
          /** Record ordinary dialog dismissal. */
          () => {
            actions.push('close');
          },
      });
      return { command, machine, dispose };
    },
  );
  try {
    const settings = items[0];
    const status = items[1];
    if (!settings || !status) throw new Error('The Command action fixtures are missing.');
    owner.machine.selectItem(settings);
    expect(actions).toEqual(['item', 'root', 'close']);
    actions.length = 0;
    owner.machine.selectItem(settings, {
      modifiers: { metaKey: true, ctrlKey: false, shiftKey: false, altKey: false },
    });
    expect(actions).toEqual(['item', 'root']);
    actions.length = 0;
    owner.machine.selectItem(status);
    flush();
    expect(owner.command().page?.value).toBe('status');
    expect(actions).toEqual(['root']);
  } finally {
    owner.dispose();
  }
}

describe('useCommand' /** Exercise action decisions independently of CSS parts. */, () => {
  it('runs actions, keeps modified selections open, and enters pages', verifiesSelectionPolicy);
});
