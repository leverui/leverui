export type AnyFunction<Arg = unknown, ReturnValue = unknown> = (...args: Arg[]) => ReturnValue;

/** Whether function. */
const isFunction = <T = AnyFunction>(value: unknown): value is T => typeof value === 'function';

/** Run if fn. */
export const runIfFn = <MaybeReturnValue, FunctionArgs>(
  valueOrFn: MaybeReturnValue | ((...fnArgs: FunctionArgs[]) => MaybeReturnValue),
  ...args: FunctionArgs[]
) =>
  isFunction<AnyFunction<FunctionArgs, MaybeReturnValue>>(valueOrFn)
    ? valueOrFn(...args)
    : (valueOrFn as unknown as MaybeReturnValue);
