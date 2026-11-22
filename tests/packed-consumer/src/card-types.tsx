import {
  Card,
  CardPropsProvider,
  type CardRootProps,
  type CardBodyProps,
  type CardTitleProps,
  type CardDescriptionProps,
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

export type ElevatedVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'elevated' }, CardRootProps>
>;
export type UnsupportedVariantRejected = ExpectFalse<
  Assignable<{ variant: 'gradient' }, CardRootProps>
>;
export type UnsupportedSizeRejected = ExpectFalse<Assignable<{ size: 'xl' }, CardRootProps>>;
export type UnknownVariantRejected = ExpectFalse<Assignable<{ variant: 'glowing' }, CardRootProps>>;
export type CardCssObjectRejected = ExpectFalse<'css' extends keyof CardRootProps ? true : false>;
export type CardRecipeRejected = ExpectFalse<'recipe' extends keyof CardRootProps ? true : false>;
export type CardStylePropRejected = ExpectFalse<'maxW' extends keyof CardRootProps ? true : false>;
export type CardPartCssObjectRejected = ExpectFalse<
  'css' extends keyof CardBodyProps ? true : false
>;
export type CardNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { color: string } }, CardRootProps>
>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'lg' } }, CardRootProps>
>;
type OptionalUnstyled = { unstyled: boolean | undefined };
export type OptionalBodyUnstyledAccepted = ExpectTrue<Assignable<OptionalUnstyled, CardBodyProps>>;
export type OptionalTitleUnstyledAccepted = ExpectTrue<
  Assignable<OptionalUnstyled, CardTitleProps>
>;
export type OptionalDescriptionUnstyledAccepted = ExpectTrue<
  Assignable<OptionalUnstyled, CardDescriptionProps>
>;
export type NamespaceTitlePropsAccepted = ExpectTrue<
  Assignable<OptionalUnstyled, Card.CardTitleProps>
>;
export type NamespaceTitleAliasAccepted = ExpectTrue<Assignable<OptionalUnstyled, Card.TitleProps>>;
/** Compile direct provider, namespace parts, and native semantic props. */
export function typedCard(): JSX.Element {
  return (
    <CardPropsProvider value={{ size: 'sm', variant: 'subtle' }}>
      <Card.Root size="lg" title="Consumer card">
        <Card.Header>
          <Card.Title>Heading</Card.Title>
          <Card.Description>Supporting text</Card.Description>
        </Card.Header>
        <Card.Body>Body content</Card.Body>
        <Card.Footer>Actions</Card.Footer>
      </Card.Root>
    </CardPropsProvider>
  );
}
