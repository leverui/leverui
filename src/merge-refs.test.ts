import { describe, expect, it, vi } from 'vitest';
import { mergeRefs } from './merge-refs';

describe('mergeRefs', () => {
  it('forwards the same element to every callback in order', () => {
    const calls: string[] = [];
    const first = vi.fn((element: object) => calls.push(`first:${element === target}`));
    const second = vi.fn((element: object) => calls.push(`second:${element === target}`));
    const target = {};

    mergeRefs(first, undefined, second)(target);

    expect(calls).toEqual(['first:true', 'second:true']);
    expect(first).toHaveBeenCalledWith(target);
    expect(second).toHaveBeenCalledWith(target);
  });

  it('accepts an empty ref list', () => {
    expect(() => mergeRefs<object>()({})).not.toThrow();
  });
});
