import { isObject } from './is';

/** Merge enumerable source properties into a target record in place. */
function merge(target: Record<string, unknown>, source: object): void {
  for (const key of Object.keys(source)) {
    const sourceValue: unknown = Reflect.get(source, key);
    if (sourceValue === undefined || key === '__proto__') continue;

    const targetValue = target[key];
    if (isObject(sourceValue)) {
      if (isObject(targetValue)) {
        merge(targetValue, sourceValue);
      } else {
        target[key] = sourceValue;
      }
      continue;
    }

    if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      for (let index = 0; index < sourceValue.length; index++) {
        const nextSource: unknown = sourceValue[index];
        const nextTarget: unknown = targetValue[index];
        if (isObject(nextSource) && isObject(nextTarget)) {
          merge(nextTarget, nextSource);
        } else {
          targetValue[index] = nextSource;
        }
      }
      continue;
    }

    target[key] = sourceValue;
  }
}

/** Merge source objects into a target and retain their combined shape. */
export function mergeWith<T extends object, U extends object>(
  target: T,
  ...sources: (U | null | undefined)[]
): T & U {
  for (const source of sources) {
    if (source != null) merge(target as Record<string, unknown>, source);
  }
  return target as T & U;
}
