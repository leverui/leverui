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
  count: '--leverui-group-count',
  index: '--leverui-group-index',
  gap: '--leverui-group-gap',
} as const;
