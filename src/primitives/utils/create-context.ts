import { hasProp, isFunction } from '@zag-js/utils';
import {
  type Context,
  createContext as createSolidContext,
  useContext as useSolidContext,
} from 'solid-js';

export interface CreateContextOptions<T> {
  strict?: boolean;
  hookName?: string;
  providerName?: string;
  errorMessage?: string;
  defaultValue?: T;
}

export type CreateContextReturn<T> = [Context<T | null>, () => T, Context<T | null>];

/** Get the error message. */
function getErrorMessage(hook: string, provider: string) {
  return `${hook} returned \`undefined\`. Seems you forgot to wrap component within ${provider}`;
}

/**
 * Create a context, its provider, and a hook that reads it. Solid 2 throws when
 * a default-less context has no provider, so the empty value is `null` and the
 * hook decides: a strict context throws a descriptive error, a loose one
 * returns `undefined`.
 */
export function createContext<T>(options: CreateContextOptions<T> = {}) {
  const {
    strict = true,
    hookName = 'useContext',
    providerName = 'Provider',
    errorMessage,
    defaultValue,
  } = options;

  const Context = createSolidContext<T | null>(defaultValue ?? null);

  /** Read the nearest  context. */
  function useContext() {
    const context = useSolidContext(Context);

    if (context == null && strict) {
      const error = new Error(errorMessage ?? getErrorMessage(hookName, providerName));
      error.name = 'ContextError';
      if (hasProp(Error, 'captureStackTrace') && isFunction(Error.captureStackTrace)) {
        Error.captureStackTrace(error, useContext);
      }
      throw error;
    }

    return context ?? undefined;
  }

  return [Context, useContext, Context] as CreateContextReturn<T>;
}
