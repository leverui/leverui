/** Shared DOM names for Group and ButtonGroup indexing and layout. */
export const groupAttributes = {
  skip: 'data-leverui-group-skip',
  autoSkip: 'data-leverui-group-auto-skip',
  item: 'data-leverui-group-item',
  first: 'data-leverui-group-first',
  last: 'data-leverui-group-last',
  between: 'data-leverui-group-between',
} as const;

/** Public group variables that consumers may override on a child. */
export const groupVariables = {
  count: '--lui-group-count',
  index: '--lui-group-index',
  gap: '--lui-group-gap',
} as const;
