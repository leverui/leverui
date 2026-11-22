import { omit } from 'solid-js';

type KeyGroups<T> = readonly (readonly (keyof T)[])[];

/** `Omit` applied to each member of a union, so prop variants stay distinct. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type Picked<T, G extends KeyGroups<T>> = { [I in keyof G]: Pick<T, G[I][number] & keyof T> };

/** The views `splitProps` returns: one per key group, then the remaining props. */
export type SplitProps<T, G extends KeyGroups<T>> = [
  ...Picked<T, G>,
  DistributiveOmit<T, G[number][number]>,
];

/**
 * Split reactive props into a view per key group and a view of the rest, the
 * Solid 2 replacement for Solid 1's `splitProps`. Every result is a live view
 * of `props`; none copies or reads a value until it is used. A key listed in
 * more than one group appears in each of those groups.
 */
export function splitProps<T extends Record<never, never>, const G extends KeyGroups<T>>(
  props: T,
  ...groups: G
): SplitProps<T, G> {
  const views: unknown[] = groups.map(
    /** Show only this group's keys. */
    (keys) => {
      const picked = new Set<PropertyKey>(keys);
      return omit(props, (key) => !picked.has(key));
    },
  );
  const listed = new Set<PropertyKey>(groups.flat());
  views.push(omit(props, (key) => listed.has(key)));
  return views as SplitProps<T, G>;
}
