import { Status, type StatusRootProps } from '@leverui/components';
import type * as LeverUIPackage from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectFalse<Value extends false> = Value;

export type StyleHookRemoved = ExpectFalse<
  'useStatusStyles' extends keyof typeof LeverUIPackage ? true : false
>;
export type ObjectCssRejected = ExpectFalse<'css' extends keyof StatusRootProps ? true : false>;
export type RecipeRejected = ExpectFalse<'recipe' extends keyof StatusRootProps ? true : false>;
export type UnknownSizeRejected = ExpectFalse<Assignable<{ size: 'xl' }, StatusRootProps>>;

/** Compile native Status attributes and a selected semantic tag. */
export function AcceptedStatusTypes(): JSX.Element {
  return (
    <Status.Root as="span" role="status" colorPalette="green" size={{ base: 'sm', md: 'lg' }}>
      <Status.Indicator as="span" aria-hidden="true" />
      Ready
    </Status.Root>
  );
}

/** Keep unsupported CSS objects, recipes, and arbitrary style props out of Status. */
export function RejectedStatusTypes(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Status has no CSS object prop. */}
      <Status.Root css={{ gap: '4px' }} />
      {/* @ts-expect-error Status has no custom recipe prop. */}
      <Status.Root recipe={{ base: { color: 'red' } }} />
      {/* @ts-expect-error Status has no arbitrary style-prop shortcut. */}
      <Status.Indicator width="12px" />
    </>
  );
}
