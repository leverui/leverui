import { splitProps } from './split-props';

type EnsureKeys<
  ExpectedKeys extends (keyof Target)[],
  Target,
> = keyof Target extends ExpectedKeys[number]
  ? unknown
  : `Missing required keys: ${Exclude<keyof Target, ExpectedKeys[number]> & string}`;

/** Create a splitter for a known set of props, checked so no key of `Target` is missed. */
export const createSplitProps =
  <Target extends Record<never, never>>() =>
  <Keys extends (keyof Target)[], Props extends Target = Target>(
    props: Props,
    keys: Keys & EnsureKeys<Keys, Target>,
  ) =>
    splitProps(props, keys);
