import {
  Skeleton,
  SkeletonCircle,
  SkeletonPropsProvider,
  SkeletonText,
  type SkeletonProps,
  type SkeletonCircleProps,
  type SkeletonTextProps,
} from '@leverui/components';
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

export type LoadingAccepted = ExpectTrue<Assignable<{ loading: false }, SkeletonProps>>;
export type VariantAccepted = ExpectTrue<Assignable<{ variant: 'shine' }, SkeletonProps>>;
export type ResponsiveVariantAccepted = ExpectTrue<
  Assignable<{ variant: { base: 'pulse'; md: 'shine' } }, SkeletonProps>
>;
export type InvalidVariantRejected = ExpectFalse<Assignable<{ variant: 'sweep' }, SkeletonProps>>;
export type CssObjectRejected = ExpectFalse<Assignable<{ css: { color: 'red' } }, SkeletonProps>>;
export type StyleShorthandRejected = ExpectFalse<Assignable<{ height: '5' }, SkeletonProps>>;
export type CustomRecipeRejected = ExpectFalse<Assignable<{ recipe: object }, SkeletonProps>>;
export type CircleSizeAccepted = ExpectTrue<Assignable<{ size: '10' }, SkeletonCircleProps>>;
export type TextLinesAccepted = ExpectTrue<Assignable<{ noOfLines: 3 }, SkeletonTextProps>>;
export type TextRendererAccepted = ExpectTrue<
  Assignable<{ children: () => JSX.Element }, SkeletonTextProps>
>;
export type TextNativeRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLDivElement) => void }, SkeletonTextProps>
>;
export type TextWrongRefRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLTextAreaElement) => void }, SkeletonTextProps>
>;
export type SelectedTagAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: HTMLElement) => void }, SkeletonProps<'section'>>
>;

/** Compile every installed Skeleton export against its public declarations. */
export function typedSkeleton(): JSX.Element {
  /** Supply repeatable content through the published Text prop type. */
  function renderTextLine(): JSX.Element {
    return <span>Loading content</span>;
  }

  return (
    <SkeletonPropsProvider value={{ variant: 'shine' }}>
      <Skeleton loading variant="pulse" />
      <SkeletonCircle size="10" />
      <SkeletonText noOfLines={2} rootProps={{ id: 'typed-skeleton-text' }}>
        {renderTextLine}
      </SkeletonText>
    </SkeletonPropsProvider>
  );
}
