import {
  Blockquote,
  BlockquotePropsProvider,
  type BlockquoteRootProps,
  type BlockquoteContentProps,
  type BlockquoteCaptionProps,
  type BlockquoteIconProps,
} from '@leverui/components';
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
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type SolidVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'solid' }, BlockquoteRootProps>
>;
export type UnknownVariantRejected = ExpectFalse<
  Assignable<{ variant: 'glowing' }, BlockquoteRootProps>
>;
export type ResponsiveAlignmentAccepted = ExpectTrue<
  Assignable<{ justify: { base: 'start'; md: 'end' } }, BlockquoteRootProps>
>;
export type NativeCiteAccepted = ExpectTrue<Assignable<{ cite: string }, BlockquoteContentProps>>;
type OptionalUnstyled = { unstyled: boolean | undefined };
export type OptionalContentUnstyledAccepted = ExpectTrue<
  Assignable<OptionalUnstyled, BlockquoteContentProps>
>;
export type OptionalCaptionUnstyledAccepted = ExpectTrue<
  Assignable<OptionalUnstyled, BlockquoteCaptionProps>
>;
export type OptionalIconUnstyledAccepted = ExpectTrue<
  Assignable<OptionalUnstyled, BlockquoteIconProps>
>;
export type NamespaceIconPropsAccepted = ExpectTrue<
  Assignable<OptionalUnstyled, Blockquote.BlockquoteIconProps>
>;
export type NamespaceIconAliasAccepted = ExpectTrue<
  Assignable<OptionalUnstyled, Blockquote.IconProps>
>;
export type StyleHookRemoved = ExpectFalse<
  'useBlockquoteStyles' extends keyof typeof LeverUIPackage ? true : false
>;
export type ObjectCssRejected = ExpectFalse<'css' extends keyof BlockquoteRootProps ? true : false>;
export type RecipeRejected = ExpectFalse<'recipe' extends keyof BlockquoteRootProps ? true : false>;
export type ResponsiveVariantAccepted = ExpectTrue<
  Assignable<{ variant: { base: 'subtle'; md: 'solid' } }, BlockquoteRootProps>
>;

/** Compile the namespace, direct provider, and semantic part props. */
export function typedBlockquote(): JSX.Element {
  return (
    <BlockquotePropsProvider value={{ variant: 'subtle' }}>
      <Blockquote.Root colorPalette="blue" justify="center">
        <Blockquote.Content cite="https://example.com">A quote</Blockquote.Content>
        <Blockquote.Caption>A writer</Blockquote.Caption>
      </Blockquote.Root>
    </BlockquotePropsProvider>
  );
}

/** Compile explicit undefined values on all public styled parts. */
export function typedOptionalBlockquote(unstyled: boolean | undefined): JSX.Element {
  return (
    <Blockquote.Root>
      <Blockquote.Icon unstyled={unstyled} />
      <Blockquote.Content unstyled={unstyled}>Optional quote</Blockquote.Content>
      <Blockquote.Caption unstyled={unstyled}>Optional caption</Blockquote.Caption>
    </Blockquote.Root>
  );
}

/** Keep unsupported styling objects and general style props out of Blockquote. */
export function rejectedBlockquoteStyles(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Blockquote has no CSS object prop. */}
      <Blockquote.Root css={{ color: 'red' }} />
      {/* @ts-expect-error Blockquote has no custom recipe prop. */}
      <Blockquote.Root recipe={{ base: { color: 'red' } }} />
      {/* @ts-expect-error Blockquote parts reject arbitrary style props. */}
      <Blockquote.Caption color="red" />
    </>
  );
}
