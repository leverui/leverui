/** Explain why breakpoint-exact responsive sizes avoid style leaks. */
export const responsiveNote = `We recommend using exact breakpoint values instead of using a \`base\` to ensure styles are properly contained.

\`\`\`tsx
// Might cause a style leak between the breakpoints
<Dialog.Root size={{ base: 'full', md: 'lg' }}>{/* ... */}</Dialog.Root>

// Works
<Dialog.Root size={{ mdDown: 'full', md: 'lg' }}>{/* ... */}</Dialog.Root>
\`\`\``;

/** Describe the initial-focus fallback order. */
export const initialFocusNote = `Without \`initialFocusEl\`, focus moves to the first element marked \`data-autofocus\`, falling back to the first tabbable element that is not marked \`data-no-autofocus\`.

\`\`\`tsx
<Input data-autofocus />
\`\`\``;

/** List the steps that make a dialog non-modal. */
export const nonModalNote = `- set the \`modal\` prop to \`false\`
- set \`pointer-events\` to \`none\` on the \`Dialog.Positioner\` component
- (optional) set the \`closeOnInteractOutside\` prop to \`false\``;
