export const controlledNote = `\`\`\`tsx
<Splitter.Root
  panels={[{ id: 'a' }, { id: 'b' }]}
  size={sizes()}
  onResize={(details) => setSizes(details.size)}
>
  {/* ... */}
</Splitter.Root>
\`\`\``;

export const collapsibleNote = `\`\`\`tsx
<Splitter.Root
  defaultSize={[40, 60]}
  panels={[
    { id: 'a', collapsible: true, collapsedSize: 5, minSize: 25 },
    { id: 'b', minSize: 50 },
  ]}
>
  {/* ... */}
</Splitter.Root>
\`\`\``;

export const keyboardNote = `- Press Tab until the resize handle is focused.
- Use Arrow keys to resize panels.
- Hold Shift for larger steps.
- Press Home / End to jump to minimum or maximum sizes.
- Control the step size using the \`keyboardResizeBy\` prop.`;
