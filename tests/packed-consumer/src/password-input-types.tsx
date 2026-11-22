import { PasswordInput, type PasswordInputProps } from '@leverui/components';
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

export type NativeInputRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLInputElement) => void }, PasswordInputProps>
>;
export type WrongElementRefRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLTextAreaElement) => void }, PasswordInputProps>
>;
export type ChildRendererRemoved = ExpectFalse<
  'asChild' extends keyof PasswordInputProps ? true : false
>;

/** Compile the installed Password Input's native callback ref contract. */
export function typedPasswordInput(): JSX.Element {
  return (
    <PasswordInput
      aria-label="Password"
      ref={
        /** Receive the native input controlled by Password Input. */
        (element: HTMLInputElement) => element.setAttribute('data-packed-ref', 'true')
      }
    />
  );
}
