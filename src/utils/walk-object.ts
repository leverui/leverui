import { isObject } from './is';

type Predicate<R> = (value: unknown, path: string[]) => R;

export type MappedObject<T, K> = {
  [Prop in keyof T]: T[Prop] extends Array<infer Item>
    ? MappedObject<Item, K>[]
    : T[Prop] extends Record<string, unknown>
      ? MappedObject<T[Prop], K>
      : K;
};

export type WalkObjectStopFn = (value: unknown, path: string[]) => boolean;

export interface WalkObjectOptions {
  stop?: WalkObjectStopFn | undefined;
  getKey?(prop: string, value: unknown): string;
}

type Nullable<T> = T | null | undefined;
/** Narrow a mapped value after skipping absent leaves. */
const isNotNullish = <T>(element: Nullable<T>): element is T => element != null;

/** Visit nested object leaves, optionally stopping at selected records. */
export function walkObject<T, K>(
  target: T,
  predicate: Predicate<K>,
  options: WalkObjectOptions = {},
): MappedObject<T, ReturnType<Predicate<K>>> {
  const { stop, getKey } = options;

  /** Map one value and its children with their current path. */
  function inner(value: unknown, path: string[] = []): unknown {
    if (isObject(value) || Array.isArray(value)) {
      const result = Array.isArray(value) ? [] : Object.create(null);
      for (const [prop, child] of Object.entries(value)) {
        const key = getKey?.(prop, child) ?? prop;
        const childPath = [...path, key];
        if (stop?.(value, childPath)) {
          return predicate(value, path);
        }

        const next = inner(child, childPath);
        if (isNotNullish(next)) {
          Reflect.set(result, key, next);
        }
      }
      return result;
    }

    return predicate(value, path);
  }

  return inner(target) as MappedObject<T, K>;
}
