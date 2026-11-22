import { Show, type ShowProps } from '@leverui/components';
import { type Accessor } from 'solid-js';
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

export type NarrowedRendererAccepted = ExpectTrue<
  Assignable<(value: Accessor<number>) => JSX.Element, ShowProps<number | undefined>['children']>
>;

/** Read a number without an undefined check inside a Show render function. */
function renderNumber(value: Accessor<number>): JSX.Element {
  return <output>{value().toFixed(2)}</output>;
}

declare const maybeNumber: number | undefined;
export const narrowedNumber = (
  <Show when={maybeNumber} fallback={<span>Missing</span>}>
    {renderNumber}
  </Show>
);
