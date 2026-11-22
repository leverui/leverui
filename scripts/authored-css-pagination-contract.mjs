/** Require Pagination's page text hook and authored weight in the bundle. */
export const paginationPageTextContract = {
  family: 'pagination',
  required: [
    '.leverui-pagination__page-text:not([data-unstyled])',
    'font-weight: var(--leverui-font-weights-medium)',
    '.leverui-button.leverui-pagination__ellipsis-button:not([data-unstyled])',
    'padding-inline: 0',
    'padding-block: 0',
    'font-size: 1.2em',
  ],
};
