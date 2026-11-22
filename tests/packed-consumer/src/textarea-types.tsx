import { Textarea, type TextareaProps, type TextareaPropsProviderProps } from '@leverui/components';

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

type ProviderDefaults = TextareaPropsProviderProps['value'];
export type ObjectCssRejected = ExpectFalse<'css' extends keyof TextareaProps ? true : false>;
export type RecipeRejected = ExpectFalse<'recipe' extends keyof TextareaProps ? true : false>;
export type StylePropRejected = ExpectFalse<'maxH' extends keyof TextareaProps ? true : false>;
export type ConditionalChoiceRejected = ExpectFalse<
  Assignable<{ size: { _hover: 'xl' } }, TextareaProps>
>;
export type ProviderRefRejected = ExpectFalse<'ref' extends keyof ProviderDefaults ? true : false>;
export type ProviderChildrenRejected = ExpectFalse<
  'children' extends keyof ProviderDefaults ? true : false
>;

/** Receive the input selected by Textarea's polymorphic prop. */
function receiveInput(element: HTMLInputElement): void {
  element.dataset.textareaRef = 'input';
}

export const selectedInput = <Textarea as="input" ref={receiveInput} aria-label="Selected input" />;
export const responsiveTextarea = (
  <Textarea
    aria-label="Responsive notes"
    size={{ base: 'sm', md: 'lg' }}
    variant={{ base: 'outline', md: 'flushed' }}
    style={{ 'max-height': '8lh' }}
  />
);
