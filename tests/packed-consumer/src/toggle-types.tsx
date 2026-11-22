import {
  Toggle,
  type ToggleIndicatorProps,
  type ToggleRootProps,
  type UseToggleProps,
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

export type TogglePressedAccepted = ExpectTrue<
  Assignable<{ pressed: true; disabled: false }, Pick<ToggleRootProps, 'pressed' | 'disabled'>>
>;
export type ToggleIndicatorFallbackAccepted = ExpectTrue<
  Assignable<{ fallback: string }, Pick<ToggleIndicatorProps, 'fallback'>>
>;
export type ToggleInvalidPressedRejected = ExpectFalse<
  Assignable<{ pressed: 'yes' }, UseToggleProps>
>;

/** Compile the installed provider, context, machine hook, and polymorphic root. */
export function PackedToggleTypes(): JSX.Element {
  const machine = Toggle.useToggle({ defaultPressed: true });
  return (
    <Toggle.PropsProvider value={{ disabled: false }}>
      <Toggle.Root as="button" aria-label="Typed Toggle">
        <Toggle.Indicator fallback="Off">On</Toggle.Indicator>
      </Toggle.Root>
      <output>{machine().pressed ? 'on' : 'off'}</output>
    </Toggle.PropsProvider>
  );
}
