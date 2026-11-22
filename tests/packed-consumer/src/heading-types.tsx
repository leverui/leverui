import { Heading, type HeadingProps, type HeadingPropsProviderProps } from '@leverui/components';

type ExpectFalse<Value extends false> = Value;
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

type ProviderDefaults = HeadingPropsProviderProps['value'];
export type ObjectCssRejected = ExpectFalse<'css' extends keyof HeadingProps ? true : false>;
export type RecipeRejected = ExpectFalse<'recipe' extends keyof HeadingProps ? true : false>;
export type StylePropRejected = ExpectFalse<'fontWeight' extends keyof HeadingProps ? true : false>;
export type ConditionalSizeRejected = ExpectFalse<
  Assignable<{ size: { _hover: 'xl' } }, HeadingProps>
>;
export type ProviderRefRejected = ExpectFalse<'ref' extends keyof ProviderDefaults ? true : false>;

/** Receive the native heading selected by Heading's polymorphic prop. */
function receiveH1(element: HTMLHeadingElement): void {
  element.dataset.headingRef = 'h1';
}

export const selectedH1 = (
  <Heading as="h1" ref={receiveH1}>
    Title
  </Heading>
);
export const responsiveHeading = (
  <Heading size={{ base: 'lg', md: '4xl' }} style={{ 'letter-spacing': '-0.02em' }}>
    Responsive title
  </Heading>
);
