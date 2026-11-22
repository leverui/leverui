import { Group, type GroupProps } from '@leverui/components';
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

export type NativeSectionAccepted = ExpectTrue<
  Assignable<{ as: 'section'; attached: boolean; children: JSX.Element }, GroupProps<'section'>>
>;
export type ResponsiveOrientationAccepted = ExpectTrue<
  Assignable<{ orientation: { base: 'horizontal'; md: 'vertical' } }, GroupProps>
>;
export type InvalidOrientationRejected = ExpectFalse<
  Assignable<{ orientation: 'diagonal' }, GroupProps>
>;
export type InvalidStackingRejected = ExpectFalse<Assignable<{ stacking: 'middle' }, GroupProps>>;
export type WrongSectionRefRejected = ExpectFalse<
  Assignable<{ as: 'section'; ref: (element: HTMLButtonElement) => void }, GroupProps<'section'>>
>;

/** Receive the native section through the installed Group declaration. */
function receiveSection(element: HTMLElement): void {
  element.dataset.groupRef = 'section';
}

/** Exclude a rendered separator through the Solid skip contract. */
function skipSeparator(element: Element): boolean {
  return element.getAttribute('data-separator') === 'yes';
}

export const nativeGroup = (
  <Group as="section" ref={receiveSection} skip={skipSeparator} orientation="vertical" attached>
    <button type="button">Action</button>
  </Group>
);
