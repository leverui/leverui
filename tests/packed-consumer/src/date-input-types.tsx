import { parseDate } from '@internationalized/date';
import {
  DateInput,
  DateInputHiddenInput,
  DateInputRoot,
  useDateInput,
  useDateInputContext,
  type DateInputRootBaseProps,
  type DateInputRootProps,
  type DateInputRootProviderBaseProps,
  type DateInputValueChangeDetails,
  type UseDateInputProps,
} from '@leverui/components';
import { For } from 'solid-js';
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

export type DateValueAccepted = ExpectTrue<
  Assignable<{ defaultValue: ReturnType<typeof parseDate>[] }, UseDateInputProps>
>;
export type InvalidDateRejected = ExpectFalse<
  Assignable<{ defaultValue: string }, UseDateInputProps>
>;
export type NativeRootAccepted = ExpectTrue<
  Assignable<{ size: 'sm'; variant: 'outline'; title: string }, DateInputRootProps>
>;
export type DateInputObjectCssRemoved = ExpectFalse<
  'css' extends keyof DateInputRootProps ? true : false
>;
export type DateInputRecipeRemoved = ExpectFalse<
  'recipe' extends keyof DateInputRootProps ? true : false
>;
export type DateInputStylePropRemoved = ExpectFalse<
  'bg' extends keyof DateInputRootProps ? true : false
>;

/** Render manual segments with the installed package's context accessor. */
function ConsumerSegments(): JSX.Element {
  const machine = useDateInputContext();
  return (
    <DateInput.SegmentGroup index={0}>
      <For each={machine().getSegments({ index: 0 })} keyed={false}>
        {
          /** Typecheck each machine segment against the named public part. */
          (segment) => <DateInput.Segment segment={segment()} />
        }
      </For>
    </DateInput.SegmentGroup>
  );
}

/** Compile named, namespace, machine, and custom-part APIs in isolation. */
export function PackedDateInputTypes(): JSX.Element {
  /** Check the public date callback payload. */
  function reportValue(details: DateInputValueChangeDetails): void {
    if (details.value.length === 0) return;
  }

  /** Keep the primitive's segment-group props on a caller-rendered element. */
  const renderGroup: NonNullable<DateInput.SegmentsProps['asChild']> = (getProps) => (
    <div {...getProps()} />
  );

  const machine = useDateInput({
    defaultValue: [parseDate('2026-03-14')],
    onValueChange: reportValue,
  });
  const rootDefaults: DateInputRootBaseProps = {
    size: 'sm',
    variant: 'outline',
    asChild: renderGroup,
  };
  const providerBase: DateInputRootProviderBaseProps = {
    value: machine,
    asChild: renderGroup,
  };

  return (
    <>
      <DateInput.PropsProvider value={rootDefaults}>
        <DateInput.RootProvider {...providerBase}>
          <DateInput.Label>Packed date</DateInput.Label>
          <DateInput.Control>
            <DateInput.Segments asChild={renderGroup} htmlTranslate="no" />
          </DateInput.Control>
          <DateInputHiddenInput name="packed-date" />
          <DateInput.Context>
            {
              /** Read a caller-owned machine through the context render prop. */
              (api) => <output>{api().value.length}</output>
            }
          </DateInput.Context>
        </DateInput.RootProvider>
        <DateInputRoot defaultValue={[parseDate('2026-04-05')]} size="lg">
          <DateInput.Label>Manual date</DateInput.Label>
          <DateInput.Control>
            <ConsumerSegments />
          </DateInput.Control>
        </DateInputRoot>
      </DateInput.PropsProvider>
    </>
  );
}
