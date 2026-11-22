export type AnyFunction<Args extends unknown[] = unknown[], Result = unknown> = (
  ...args: Args
) => Result;

export type Dict<T = unknown> = Record<string, T>;

export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type DistributiveUnion<T, U> = {
  [K in keyof T]: K extends keyof U ? U[K] | T[K] : T[K];
} & DistributiveOmit<U, keyof T>;

export type Pretty<T> = { [K in keyof T]: T[K] } & {};
