import { Container, ContainerPropsProvider, type ContainerProps } from '@leverui/components';
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

export type NativeAnchorAccepted = ExpectTrue<
  Assignable<{ as: 'a'; href: string; fluid: boolean; children: JSX.Element }, ContainerProps<'a'>>
>;
export type ResponsiveFluidAccepted = ExpectTrue<
  Assignable<{ fluid: { base: boolean; lg: boolean } }, ContainerProps>
>;
export type TextFluidRejected = ExpectFalse<Assignable<{ fluid: string }, ContainerProps>>;
export type CssObjectRejected = ExpectFalse<'css' extends keyof ContainerProps ? true : false>;
export type MaxWidthPropRejected = ExpectFalse<'maxW' extends keyof ContainerProps ? true : false>;
export type RecipePropRejected = ExpectFalse<'recipe' extends keyof ContainerProps ? true : false>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { maxWidth: string } }, ContainerProps>
>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, ContainerProps<'a'>>
>;

/** Receive the selected native anchor through the installed declaration. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.containerRef = 'anchor';
}

export const anchor = (
  <Container as="a" href="/docs" ref={receiveAnchor} centerContent>
    Container docs
  </Container>
);

export const provider = (
  <ContainerPropsProvider value={{ fluid: true }}>
    <Container>Provided container</Container>
  </ContainerPropsProvider>
);
