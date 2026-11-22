import { describe, expect, it } from 'vitest';
import {
  formatPaginationPageText,
  type PaginationPageTextFormatDetails,
} from './pagination-page-text';

const details: PaginationPageTextFormatDetails = {
  page: 2,
  totalPages: 5,
  pageRange: { start: 10, end: 20 },
  count: 46,
};

/** Check the three built-in page text formats. */
function verifiesBuiltInFormats(): void {
  expect(formatPaginationPageText(details, 'short')).toBe('2 / 5');
  expect(formatPaginationPageText(details, 'compact')).toBe('2 of 5');
  expect(formatPaginationPageText(details, 'long')).toBe('11 - 20 of 46');
}

/** Keep the final range within the machine's item count. */
function verifiesFinalRange(): void {
  expect(
    formatPaginationPageText({ ...details, page: 5, pageRange: { start: 40, end: 50 } }, 'long'),
  ).toBe('41 - 46 of 46');
}

/** Give a custom formatter the complete current machine details. */
function verifiesCustomFormat(): void {
  const result = formatPaginationPageText(
    details,
    /** Read page, page count, and item count from the custom format contract. */
    ({ page, totalPages, count }) => `Página ${page} de ${totalPages}; ${count} items`,
  );
  expect(result).toBe('Página 2 de 5; 46 items');
}

describe('Pagination page text', () => {
  it('matches the three built-in formats', verifiesBuiltInFormats);
  it('caps the final item range', verifiesFinalRange);
  it('passes machine details to custom formatting', verifiesCustomFormat);
});
