/** Require Pagination's page text hook and authored weight in the bundle. */
export const paginationPageTextContract = {
  family: 'pagination',
  required: [
    '.lui-pagination__page-text:not([data-unstyled])',
    'font-weight: var(--lui-font-weights-medium)',
    '.lui-button.lui-pagination__ellipsis-button:not([data-unstyled])',
    'padding-inline: 0',
    'padding-block: 0',
    'font-size: 1.2em',
  ],
};
