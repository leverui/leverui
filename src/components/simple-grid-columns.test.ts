import { describe, expect, it } from 'vitest';
import { countToColumns, widthToColumns } from './simple-grid-columns';

/** Verify equal tracks and retained responsive count branches. */
function verifiesColumnCounts(): void {
  expect(countToColumns(3)).toEqual({ base: 'repeat(3, minmax(0, 1fr))' });
  expect(countToColumns([2, null, 4])).toEqual({
    base: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))',
  });
  expect(countToColumns({ base: 2, md: 3 })).toEqual({
    base: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(3, minmax(0, 1fr))',
  });
}

/** Verify public size variables and CSS length fallbacks. */
function verifiesMinimumWidths(): void {
  expect(widthToColumns('24')).toEqual({
    base: 'repeat(auto-fit, minmax(var(--leverui-sizes-24), 1fr))',
  });
  expect(widthToColumns(111)).toEqual({
    base: 'repeat(auto-fit, minmax(var(--leverui-sizes-111, 111px), 1fr))',
  });
  expect(widthToColumns({ base: '100px', md: 'min(30vw, 16rem)' })).toEqual({
    base: 'repeat(auto-fit, minmax(100px, 1fr))',
    md: 'repeat(auto-fit, minmax(min(30vw, 16rem), 1fr))',
  });
}

/** Verify absent widths and skipped responsive slots produce no track CSS. */
function verifiesSkippedWidths(): void {
  expect(widthToColumns(undefined)).toEqual({});
  expect(widthToColumns(['100px', undefined, '140px'])).toEqual({
    base: 'repeat(auto-fit, minmax(100px, 1fr))',
    md: 'repeat(auto-fit, minmax(140px, 1fr))',
  });
  expect(widthToColumns({ base: undefined, md: '140px' })).toEqual({
    md: 'repeat(auto-fit, minmax(140px, 1fr))',
  });
}

/** Reject conditions that authored CSS cannot represent. */
function rejectsNestedConditions(): void {
  expect(() => countToColumns({ md: { _hover: 2 } } as never)).toThrow(/breakpoint/);
}

/** Register focused cases for the pure track mappers. */
function registerTrackMappingCases(): void {
  it('keeps scalar, array, and ordinary responsive column counts', verifiesColumnCounts);
  it('resolves size tokens and CSS lengths for auto-fit tracks', verifiesMinimumWidths);
  it('keeps undefined array slots and omits undefined object branches', verifiesSkippedWidths);
  it('rejects nested runtime conditions', rejectsNestedConditions);
}

describe('SimpleGrid track mapping', registerTrackMappingCases);
