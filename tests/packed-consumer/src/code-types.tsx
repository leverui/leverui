import {
  Code,
  CodePropsProvider,
  type CodeProps,
  type CodePropsProviderProps,
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
type ProviderDefaults = Exclude<CodePropsProviderProps['value'], (...args: never[]) => unknown>;

export type CodeSurfaceAccepted = ExpectTrue<Assignable<{ variant: 'surface' }, CodeProps>>;
export type CodeBrandRejected = ExpectFalse<Assignable<{ variant: 'brand' }, CodeProps>>;
export type CodeExtraLargeRejected = ExpectFalse<Assignable<{ size: 'xl' }, CodeProps>>;
export type CodeUnknownVariantRejected = ExpectFalse<Assignable<{ variant: 'glowing' }, CodeProps>>;
export type CodeCssObjectRejected = ExpectFalse<'css' extends keyof CodeProps ? true : false>;
export type CodeRecipeRejected = ExpectFalse<'recipe' extends keyof CodeProps ? true : false>;
export type CodeClassNameAccepted = ExpectTrue<Assignable<{ className: string }, CodeProps>>;
export type CodeResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'xs'; md: 'lg' } }, CodeProps>
>;
export type CodeOptionalUnstyledAccepted = ExpectTrue<
  Assignable<{ unstyled: boolean | undefined }, CodeProps>
>;
export type CodeProviderOptionalUnstyledAccepted = ExpectTrue<
  Assignable<{ unstyled: boolean | undefined }, ProviderDefaults>
>;
export type CodeProviderClassAccepted = ExpectTrue<Assignable<{ class: string }, ProviderDefaults>>;
export type CodeProviderNativeRefRejected = ExpectFalse<
  'ref' extends keyof ProviderDefaults ? true : false
>;
export type CodeSpanRefAccepted = ExpectTrue<
  Assignable<{ as: 'span'; ref: (element: HTMLSpanElement) => void }, CodeProps<'span'>>
>;
export type CodeWrongSpanRefRejected = ExpectFalse<
  Assignable<{ as: 'span'; ref: (element: HTMLButtonElement) => void }, CodeProps<'span'>>
>;

/** Capture a selected native span in the installed consumer. */
function captureSpan(element: HTMLSpanElement): void {
  element.dataset.codeRef = 'span';
}

/** Compile Code's public CSS appearance, component provider, and native element types. */
export function typedCode(): JSX.Element {
  return (
    <CodePropsProvider value={{ size: 'lg', variant: 'outline' }}>
      <Code as="span" ref={captureSpan} colorPalette="blue">
        Typed code
      </Code>
    </CodePropsProvider>
  );
}
