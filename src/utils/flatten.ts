import { type WalkObjectStopFn, walkObject } from './walk-object';
import { isObject } from './is';

/** Flattens nested token records into dot-delimited value paths. */
export function flatten(
  values: Record<string, unknown>,
  stop?: WalkObjectStopFn,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  walkObject(
    values,
    /** Capture the value at each token path. */
    (token, paths) => {
      if (isObject(token) && 'value' in token) {
        result[paths.join('.')] = token.value;
      }
    },
    { stop },
  );

  return result;
}
