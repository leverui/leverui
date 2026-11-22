import { describe, expect, it } from 'vitest';
import { walkObject } from './walk-object';

/** Preserve a visited value without changing its type. */
function keepValue(value: unknown): unknown {
  return value;
}

/** Keep root and nested arrays usable as arrays after traversal. */
function preservesArrayShape(): void {
  const result = walkObject([{ sizes: [1, 2] }], keepValue);

  expect(Array.isArray(result)).toBe(true);
  const [first] = result;
  if (!first) throw new Error('Expected the traversed array entry.');
  expect(Array.isArray(first.sizes)).toBe(true);
  expect(
    first.sizes.map(
      /** Double one traversed array element. */
      (size) => Number(size) * 2,
    ),
  ).toEqual([2, 4]);
}

/** Leave responsive values intact when a caller stops before array traversal. */
function honorsArrayStop(): void {
  const responsive = ['sm', 'lg'];
  const result = walkObject({ responsive }, keepValue, {
    /** Treat arrays as atomic responsive values. */
    stop: (value) => Array.isArray(value),
  });

  expect(result.responsive).toBe(responsive);
}

/** Register regressions for array traversal and stop behavior. */
function defineObjectWalkerTests(): void {
  it('preserves array shape', preservesArrayShape);
  it('honors a caller that stops at arrays', honorsArrayStop);
}

describe('object walker', defineObjectWalkerTests);
