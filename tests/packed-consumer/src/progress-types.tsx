import {
  Progress,
  type ProgressRootProps,
  type ProgressTrackProps,
  type UseProgressProps,
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

export type SizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, ProgressRootProps>>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'xl' } }, ProgressRootProps>
>;
export type InvalidSizeRejected = ExpectFalse<Assignable<{ size: 'huge' }, ProgressRootProps>>;
export type NullValueAccepted = ExpectTrue<Assignable<{ value: null }, ProgressRootProps>>;
export type SelectedTrackRefAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: HTMLElement) => void }, ProgressTrackProps<'section'>>
>;
export type MachineValueAccepted = ExpectTrue<Assignable<{ value: 25 }, UseProgressProps>>;

/** Compile public Progress parts against the installed declarations. */
export function typedProgress(): JSX.Element {
  return (
    <Progress.Root as="section" value={25} size="sm">
      <Progress.Label id="typed-progress-label">Uploading</Progress.Label>
      <Progress.ValueText />
      <Progress.Track aria-labelledby="typed-progress-label">
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
}

/** Ensure the installed Progress surface rejects unsupported styling props. */
export function rejectedProgressStyles(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Progress has no CSS object prop. */}
      <Progress.Root css={{ height: '10px' }} />
      {/* @ts-expect-error Progress has no custom recipe prop. */}
      <Progress.Root recipe={{}} />
      {/* @ts-expect-error Progress parts reject general style shorthands. */}
      <Progress.Track mt="2" />
    </>
  );
}
