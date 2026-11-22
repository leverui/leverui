import { createMemoKey } from './memo-key';

/** Keeps a bounded set of recently used memoized values. */
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  /** Set the maximum number of cached entries. */
  constructor(maxSize: number = 500) {
    this.maxSize = maxSize;
  }

  /** Read and refresh a cached value. */
  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  /** Insert a value, evicting the least recently used entry if needed. */
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  /** Remove all cached entries. */
  clear(): void {
    this.cache.clear();
  }
}

/** Memoize a function by its arguments while preserving its call signature. */
export const memo = <T extends (...args: never[]) => unknown>(fn: T): T => {
  const cache = new LRUCache<string, ReturnType<T>>();
  const keyForArguments = createMemoKey();

  /** Resolve an argument key from cache or invoke the original function. */
  function get(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    const key = keyForArguments(args);

    let result = cache.get(key);
    if (result === undefined) {
      result = fn.apply(this, args) as ReturnType<T>;
      cache.set(key, result);
    }
    return result;
  }
  return get as T;
};
