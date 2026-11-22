import { $PROXY, type Merge } from 'solid-js';

type Source = object | (() => object | false | undefined | null) | false | undefined | null;

/**
 * The merged shape of `sources`. Solid's own `Merge` type already models a
 * later source's defined value winning, so this reuses it.
 */
export type MergedProps<T extends readonly unknown[]> = Merge<[...T]>;

/** Read a source, calling a function source so it tracks like a memo read. */
function resolve(source: Source): object {
  // A falsy source, such as `cond && { ... }`, contributes nothing.
  return (typeof source === 'function' ? source() : source) || {};
}

/**
 * Merge props-like objects into one live view in which the last source that
 * defines a key wins. A key a later source sets to `undefined` falls through
 * to earlier sources, as in Solid 1's `mergeProps`; Solid 2's `merge` lets
 * `undefined` override instead, which would discard defaults whenever a
 * wrapper forwards an unset prop. Reads go to the sources, so tracking is
 * per key; function sources are called on each read.
 */
export function mergeProps<const T extends readonly Source[]>(...sources: T): MergedProps<T> {
  // Only string keys are props. Forwarding symbols would expose a source's
  // internal markers, such as those of a Solid `omit` view, as this view's own.
  /** Find the last defined value for a key. */
  const read = (key: string): unknown => {
    for (let index = sources.length - 1; index >= 0; index--) {
      const value: unknown = Reflect.get(resolve(sources[index]), key);
      if (value !== undefined) return value;
    }
    return undefined;
  };
  /**
   * Check whether any source has a key, from the last source back, as `read`
   * does. Stopping at the first match keeps a lookup such as `'children' in
   * props` from calling, and so subscribing to, earlier function sources.
   */
  const has = (key: string): boolean => {
    for (let index = sources.length - 1; index >= 0; index--) {
      if (key in resolve(sources[index])) return true;
    }
    return false;
  };
  /** List the string keys of every source, in first-seen order. */
  const keys = (): string[] => {
    const all = new Set<string>();
    for (const source of sources)
      for (const key of Object.getOwnPropertyNames(resolve(source))) all.add(key);
    return [...all];
  };
  const view: MergedProps<T> = new Proxy(Object.create(null), {
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
  return view;
}
