import {
  ProgressCircle,
  type ProgressCircleCircleProps,
  type ProgressCircleRootBaseProps,
  type ProgressCircleRootProps,
  type ProgressCircleRootProviderBaseProps,
  type ProgressCircleTrackProps,
  type UseProgressReturn,
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

export type SizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, ProgressCircleRootProps>>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'xl' } }, ProgressCircleRootProps>
>;
export type InvalidSizeRejected = ExpectFalse<
  Assignable<{ size: 'huge' }, ProgressCircleRootProps>
>;
export type NullValueAccepted = ExpectTrue<Assignable<{ value: null }, ProgressCircleRootProps>>;
export type SvgRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: SVGSVGElement) => void }, ProgressCircleCircleProps>
>;
export type SvgTrackAccepted = ExpectTrue<
  Assignable<{ strokeWidth: string }, ProgressCircleTrackProps>
>;
export type RootBaseSupportsComposition = ExpectTrue<
  'asChild' extends keyof ProgressCircleRootBaseProps ? true : false
>;
export type ProviderBaseSupportsComposition = ExpectTrue<
  'asChild' extends keyof ProgressCircleRootProviderBaseProps ? true : false
>;
export type ProviderBaseRequiresMachine = ExpectFalse<
  Assignable<object, ProgressCircleRootProviderBaseProps>
>;
export type ProviderBaseAcceptsMachine = ExpectTrue<
  Assignable<{ value: UseProgressReturn }, ProgressCircleRootProviderBaseProps>
>;

/** Compile the public Circle parts against installed declarations. */
export function typedProgressCircle(): JSX.Element {
  return (
    <ProgressCircle.Root value={25} size="sm">
      <ProgressCircle.Label id="typed-circle-label">Uploading</ProgressCircle.Label>
      <ProgressCircle.Circle aria-labelledby="typed-circle-label">
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap="round" />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText />
    </ProgressCircle.Root>
  );
}

/** Ensure installed Circle parts reject unsupported object styling props. */
export function rejectedCircleStyles(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Circle has no CSS object prop. */}
      <ProgressCircle.Root css={{ width: '40px' }} />
      {/* @ts-expect-error Circle has no custom recipe prop. */}
      <ProgressCircle.Root recipe={{}} />
      {/* @ts-expect-error SVG parts reject arbitrary style shorthands. */}
      <ProgressCircle.Track mt="2" />
    </>
  );
}
