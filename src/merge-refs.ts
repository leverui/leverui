/**
 * A ref that receives a mounted Solid element: a callback, or, as Solid 2
 * allows, an array of refs.
 */
export type LeverUIRef<T> = ((element: T) => void) | readonly LeverUIRef<T>[] | undefined;

/** Deliver an element to a callback ref or to every ref in an array. */
export function applyLeverUIRef<T>(ref: unknown, element: T): void {
  if (typeof ref === 'function') ref(element);
  else if (Array.isArray(ref)) for (const entry of ref) applyLeverUIRef(entry, element);
}

/** Combine refs so each owner receives the same mounted element. */
export function mergeRefs<T>(...refs: ReadonlyArray<LeverUIRef<T>>): (element: T) => void {
  /** Forward the mounted element to every available ref. */
  return function notifyRefs(element: T): void {
    for (const ref of refs) applyLeverUIRef(ref, element);
  };
}
