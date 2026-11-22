import { Tag, type TagRootProps } from '@leverui/components';
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
  'useTagStyles' extends keyof typeof LeverUIPackage ? true : false
>;
export type ObjectCssRejected = ExpectFalse<'css' extends keyof TagRootProps ? true : false>;
export type RecipeRejected = ExpectFalse<'recipe' extends keyof TagRootProps ? true : false>;
export type UnknownVariantRejected = ExpectFalse<Assignable<{ variant: 'ghost' }, TagRootProps>>;

/** Compile native, selected-tag, and responsive Tag props. */
export function AcceptedTagTypes(): JSX.Element {
  return (
    <Tag.Root as="button" type="button" size={{ base: 'sm', md: 'lg' }} variant="outline">
      <Tag.Label>Filter</Tag.Label>
      <Tag.EndElement>
        <Tag.CloseTrigger aria-label="Remove filter" />
      </Tag.EndElement>
    </Tag.Root>
  );
}

/** Keep unsupported CSS objects, recipes, and arbitrary style props out of Tag. */
export function RejectedTagTypes(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Tag has no CSS object prop. */}
      <Tag.Root css={{ gap: '4px' }} />
      {/* @ts-expect-error Tag has no custom recipe prop. */}
      <Tag.Root recipe={{ base: { color: 'red' } }} />
      {/* @ts-expect-error Tag has no arbitrary style-prop shortcut. */}
      <Tag.Label padding="4px" />
    </>
  );
}
