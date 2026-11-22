import { mergeProps as mergeZagProps } from '@zag-js/core';
import { $PROXY } from 'solid-js';

type Source = object | (() => object | false | undefined | null) | false | undefined | null;

/** A source value or an accessor for it, as Zag's adapter accepts. */
export type MaybeAccessor<T> = T | (() => T);

/** Read a source, calling a function source so it tracks like a memo read. */
const resolve = (source: Source): object =>
  (typeof source === 'function' ? source() : source) || {};

/** Props whose values combine across sources instead of the last one winning. */
const isComposed = (key: string) =>
  key === 'style' ||
  key === 'class' ||
  key === 'className' ||
  key === 'data-ownedby' ||
  key.startsWith('on');

/**
 * Merge a part's machine props with the caller's props, as `@zag-js/solid`'s
 * `mergeProps` does: event handlers chain, classes join, styles merge, and for
 * other keys the last defined value wins. Unlike Zag's adapter, presence checks
 * run from the last source back and stop at the first match, so a check such as
 * Solid 2's `'children' in props` does not call, and subscribe to, the machine
 * prop getter in front of the caller's props.
 */
export function mergeProps<T>(source: MaybeAccessor<T>): T;
export function mergeProps<T, U>(source: MaybeAccessor<T>, source1: MaybeAccessor<U>): T & U;
export function mergeProps<T, U, V>(
  source: MaybeAccessor<T>,
  source1: MaybeAccessor<U>,
  source2: MaybeAccessor<V>,
): T & U & V;
export function mergeProps<T, U, V, W>(
  source: MaybeAccessor<T>,
  source1: MaybeAccessor<U>,
  source2: MaybeAccessor<V>,
  source3: MaybeAccessor<W>,
): T & U & V & W;
export function mergeProps(...sources: Source[]): unknown {
  /** Read one key across the sources. */
  const read = (key: string): unknown => {
    if (isComposed(key)) {
      let merged: Record<string, unknown> = {};
      for (const source of sources)
        merged = mergeZagProps(merged, { [key]: Reflect.get(resolve(source), key) });
      return merged[key];
    }
    for (let index = sources.length - 1; index >= 0; index--) {
      const value: unknown = Reflect.get(resolve(sources[index]), key);
      if (value !== undefined) return value;
    }
    return undefined;
  };
  /** Check the sources for a key, last first. */
  const has = (key: string): boolean => {
    for (let index = sources.length - 1; index >= 0; index--) {
      if (Object.prototype.hasOwnProperty.call(resolve(sources[index]), key)) return true;
    }
    return false;
  };
  /** List the keys of every source. */
  const keys = (): string[] => {
    const all = new Set<string>();
    for (const source of sources)
      for (const key of Object.getOwnPropertyNames(resolve(source))) all.add(key);
    return [...all];
  };
  return new Proxy(Object.create(null), {
    /** Read a key through the sources. */
    get(_target, key, receiver) {
      if (key === $PROXY) return receiver;
      return typeof key === 'string' ? read(key) : undefined;
    },
    /** Report whether a source has the key. */
    has(_target, key) {
      if (key === $PROXY) return true;
      return typeof key === 'string' && has(key);
    },
    ownKeys: keys,
    /** Describe a key as a live, enumerable getter. */
    getOwnPropertyDescriptor(_target, key) {
      if (typeof key !== 'string' || !has(key)) return undefined;
      return {
        configurable: true,
        enumerable: true,
        /** Read the key through the sources. */
        get: () => read(key),
      };
    },
    /** Ignore writes; the view is read-only. */
    set: () => true,
    /** Ignore deletes; the view is read-only. */
    deleteProperty: () => true,
  });
}
