import type { MergedProps as MergeProps } from './primitives/utils/merge-props';

export type PropSource = object | (() => object);

type SourceValue<Source> = Source extends () => infer Value ? Value : Source;
type PropOf<Source, Key extends PropertyKey> = Key extends keyof SourceValue<Source>
  ? SourceValue<Source>[Key]
  : never;
type StyleOf<Source> = PropOf<Source, 'style'>;

/** Model each possible source value before folding the next style. */
type MergeStyleValue<Current, Next> = Next extends null | undefined
  ? Current
  : Current extends object
    ? Next extends object
      ? Current & Next
      : Next
    : Next;
type MergeStyle<Current, Next> = [Next] extends [never]
  ? Current
  : [Current] extends [never]
    ? Next
    : Next extends unknown
      ? Current extends unknown
        ? MergeStyleValue<Current, Next>
        : never
      : never;
type MergeStyles<Sources extends unknown[], Current = never> = Sources extends [
  infer Source,
  ...infer Rest,
]
  ? MergeStyles<Rest, MergeStyle<Current, StyleOf<Source>>>
  : Current;

type MergeClass<Current, Next> = [Next] extends [never]
  ? Current
  : [Next] extends [undefined]
    ? Current
    : [Current] extends [never]
      ? Next
      : undefined extends Next
        ? Current | string
        : string;
type MergeClasses<
  Sources extends unknown[],
  Key extends PropertyKey,
  Current = never,
> = Sources extends [infer Source, ...infer Rest]
  ? MergeClasses<Rest, Key, MergeClass<Current, PropOf<Source, Key>>>
  : Current;

type EventArguments<Handler> = Handler extends readonly [infer Callback, unknown]
  ? Callback extends (...args: infer Args) => unknown
    ? Args extends [unknown, ...infer Rest]
      ? Rest
      : []
    : never
  : Handler extends (...args: infer Args) => unknown
    ? Args
    : never;
type IsHandler<Value> = [EventArguments<Value>] extends [never] ? false : true;
type MergeEventValue<Current, Next> = Next extends undefined
  ? Current
  : IsHandler<Current> extends true
    ? IsHandler<Next> extends true
      ? (...args: EventArguments<Next>) => void
      : Next
    : Next;
type MergeEvent<Current, Next> = [Next] extends [never]
  ? Current
  : [Current] extends [never]
    ? Next
    : Next extends unknown
      ? Current extends unknown
        ? MergeEventValue<Current, Next>
        : never
      : never;
type MergeEvents<
  Sources extends unknown[],
  Key extends PropertyKey,
  Current = never,
> = Sources extends [infer Source, ...infer Rest]
  ? MergeEvents<Rest, Key, MergeEvent<Current, PropOf<Source, Key>>>
  : Current;
type IsEventKey<Key extends string> = Key extends `on:${string}` | `oncapture:${string}`
  ? true
  : Key extends `on${infer Tail}`
    ? Tail extends ''
      ? false
      : Tail extends Capitalize<Tail>
        ? true
        : false
    : false;

/** Mirror the runtime's ordered class, style, and event merge rules. */
export type MergedProps<Sources extends PropSource[]> = {
  [Key in keyof MergeProps<Sources>]: Key extends 'class' | 'className'
    ? MergeClasses<Sources, Key>
    : Key extends 'style'
      ? MergeStyles<Sources>
      : Key extends string
        ? IsEventKey<Key> extends true
          ? MergeEvents<Sources, Key>
          : MergeProps<Sources>[Key]
        : MergeProps<Sources>[Key];
};
