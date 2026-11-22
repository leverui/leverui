import { createContext, useContext, type Context } from 'solid-js';

/** The value `useOptionalContext` returns: `null`, meaning no provider, reads as `undefined`. */
export type OptionalContextValue<T> = null extends T ? Exclude<T, null> | undefined : T;

/**
 * Create a context that may have no provider. Solid 2 throws when a
 * default-less context is read outside a provider; an optional context uses
 * `null` as its empty value instead, as Solid recommends.
 */
export function createOptionalContext<T>(): Context<T | null> {
  return createContext<T | null>(null);
}

/** Read a context, returning `undefined` when an optional context has no provider. */
export function useOptionalContext<T>(context: Context<T>): OptionalContextValue<T> {
  const value = useContext(context);
  return (value === null ? undefined : value) as OptionalContextValue<T>;
}
