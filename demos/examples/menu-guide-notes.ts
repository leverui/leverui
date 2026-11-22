export const linksNote = `When using custom router links, you need to set the \`navigate\` prop on the \`Menu.Root\` component.

\`\`\`tsx
import { Menu } from '@leverui/components';
import { useNavigate } from '@solidjs/router';

export function Demo() {
  const navigate = useNavigate();

  return (
    <Menu.Root navigate={({ value }) => navigate(\`/\${value}\`)}>
      {/* ... */}
    </Menu.Root>
  );
}
\`\`\``;

export const overflowNote = `> The content has a default \`max-height: var(--available-height)\`, which is the maximum available height for the content relative to the viewport.`;

export const openFromDialogNote = `\`\`\`diff
-<Portal>
  <Menu.Positioner>
    <Menu.Content>
      {/* ... */}
    </Menu.Content>
  </Menu.Positioner>
-</Portal>
\`\`\`

If you have set \`scrollBehavior="inside"\` on the \`Dialog\`, you need to:

- Set the menu positioning to \`fixed\` to avoid the menu from being clipped by the dialog.
- Set \`hideWhenDetached\` to \`true\` to hide the menu when the trigger is scrolled out of view.

\`\`\`tsx
<Menu.Root positioning={{ strategy: 'fixed', hideWhenDetached: true }}>
  {/* ... */}
</Menu.Root>
\`\`\``;
