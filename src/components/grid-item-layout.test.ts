import { describe, expect, it } from 'vitest';
import { gridItemSelectionAttributes, gridItemVariableStyle } from './grid-item-layout';

/** Verify ordinary responsive spans select only their declared breakpoints. */
function verifiesResponsiveSpans(): void {
  const placement = { colSpan: { base: 1, md: 2 }, rowSpan: 'auto' } as const;
  expect(gridItemSelectionAttributes(placement)).toMatchObject({
    'data-grid-item-column-base': '',
    'data-grid-item-column-md': '',
    'data-grid-item-row-base': '',
  });
  expect(gridItemVariableStyle(placement, undefined)).toMatchObject({
    '--lui-private-grid-item-column-base': 'span 1/span 1',
    '--lui-private-grid-item-column-md': 'span 2/span 2',
    '--lui-private-grid-item-row-base': 'auto',
  });
}

/** Reject a malformed span before it reaches a CSS declaration. */
function rejectsMalformedSpan(): void {
  expect(() => gridItemSelectionAttributes({ colSpan: 'two' as never })).toThrow(
    /numeric spans or "auto"/,
  );
}

/** Register pure placement checks for the GridItem CSS boundary. */
function registerGridItemCases(): void {
  it('keeps responsive span selections distinct', verifiesResponsiveSpans);
  it('rejects malformed span values', rejectsMalformedSpan);
}

describe('GridItem placement', registerGridItemCases);
