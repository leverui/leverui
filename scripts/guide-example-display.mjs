/** Adapt authored Storybook JSDoc into concise product-facing guide copy. */
export function exampleDescription(node) {
  const comment = node.jsDoc?.[0]?.comment;
  if (typeof comment !== 'string' || /\bReact\b/i.test(comment)) return '';
  return comment.trim();
}
