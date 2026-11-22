import {
  createContext as createSolidContext,
  useContext as useSolidContext,
  type Context,
  type ContextProviderComponent,
} from 'solid-js';

export interface CreateContextOptions<Value> {
  strict?: boolean;
  hookName?: string;
  providerName?: string;
  errorMessage?: string;
  name?: string;
  defaultValue?: Value;
}

export type CreateContextReturn<Value, UsedValue = Value> = [
  ContextProviderComponent<Value | null>,
  () => UsedValue,
  Context<Value | null>,
];

/** Build the provider-missing message from the public hook and provider names. */
function missingProviderMessage(hookName: string, providerName: string): string {
  return `${hookName} returned \`undefined\`. Seems you forgot to wrap component within ${providerName}`;
}

/** Create a Solid context with a strict, named lookup function. */
export function createContext<Value>(
  options: CreateContextOptions<Value> & { strict: false },
): CreateContextReturn<Value, Value | undefined>;
/** Create a Solid context whose lookup requires a provider or default value. */
export function createContext<Value>(
  options?: CreateContextOptions<Value> & { strict?: true },
): CreateContextReturn<Value>;
/** Preserve a possibly absent value when strictness changes at runtime. */
export function createContext<Value>(
  options: CreateContextOptions<Value>,
): CreateContextReturn<Value, Value | undefined>;
/** Build one provider, lookup function, and context tuple. */
export function createContext<Value>(
  options: CreateContextOptions<Value> = {},
): CreateContextReturn<Value, Value | undefined> {
  // Solid 2 throws when a default-less context has no provider; `null` marks
  // "no provider" so this lookup can report it with the configured message.
  const context = createSolidContext<Value | null>(options.defaultValue ?? null);

  /** Read the nearest value or report a missing strict provider. */
  function useContext(): Value | undefined {
    const value = useSolidContext(context) ?? undefined;
    if (value === undefined && options.strict !== false) {
      const error = new Error(
        options.errorMessage ??
          missingProviderMessage(
            options.hookName ?? 'useContext',
            options.providerName ?? options.name ?? 'Provider',
          ),
      );
      error.name = 'ContextError';
      throw error;
    }
    return value;
  }

  return [context, useContext, context];
}
