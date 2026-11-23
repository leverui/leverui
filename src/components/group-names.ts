/** Shared DOM names for Group and ButtonGroup indexing and layout. */
export const groupAttributes = {
  skip: 'data-lui-group-skip',
  autoSkip: 'data-lui-group-auto-skip',
  item: 'data-lui-group-item',
  first: 'data-lui-group-first',
  last: 'data-lui-group-last',
  between: 'data-lui-group-between',
} as const;

/** Public group variables that consumers may override on a child. */
export const groupVariables = {
  count: '--lui-group-count',
  index: '--lui-group-index',
  gap: '--lui-group-gap',
} as const;
