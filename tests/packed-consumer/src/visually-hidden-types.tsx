import { VisuallyHidden, type VisuallyHiddenProps } from '@leverui/components';
import { type JSX } from '@solidjs/web';

type LabelProps = VisuallyHiddenProps<'label'>;
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

export type NativeLabelAccepted = ExpectTrue<Assignable<{ as: 'label'; for: string }, LabelProps>>;
export type ObjectCssRejected = ExpectFalse<'css' extends keyof VisuallyHiddenProps ? true : false>;
export type GeneralStylePropRejected = ExpectFalse<
  'fontWeight' extends keyof VisuallyHiddenProps ? true : false
>;

type GetChildProps = Parameters<NonNullable<VisuallyHiddenProps['asChild']>>[0];

/** Preserve a native input's label while applying the hidden parent props. */
function renderInput(getProps: GetChildProps): JSX.Element {
  return <input {...getProps()} aria-label="Type checked hidden input" />;
}

export const hiddenNativeLabel = (
  <VisuallyHidden as="label" for="consumer-input">
    Consumer input
  </VisuallyHidden>
);
export const hiddenChildInput = <VisuallyHidden asChild={renderInput} />;
