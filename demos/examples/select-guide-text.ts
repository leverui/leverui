const dialogDiff = `\`\`\`diff
-<Portal>
  <Select.Positioner>
    <Select.Content>
      <Select.List>
        {/* ... */}
      </Select.List>
    </Select.Content>
  </Select.Positioner>
-</Portal>
\`\`\``;

const dialogScroll = `If you have set \`scrollBehavior="inside"\` on the \`Dialog\`, you need to:

- Set the select positioning to \`fixed\` to avoid the select from being clipped by the dialog.
- Set \`hideWhenDetached\` to \`true\` to hide the select when the trigger is scrolled out of view.

\`\`\`tsx
<Select.Root positioning={{ strategy: 'fixed', hideWhenDetached: true }}>
  {/* ... */}
</Select.Root>
\`\`\``;

/** Guide text for the Select inside a Dialog example. */
export const selectDialogGuide = {
  description:
    "To use the `Select` within a `Dialog`, you need to avoid portalling the `Select.Positioner` to the document's body.",
  after: `${dialogDiff}\n\n${dialogScroll}`,
};
