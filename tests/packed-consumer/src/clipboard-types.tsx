import {
  Clipboard,
  ClipboardIndicator,
  ClipboardRoot,
  ClipboardTrigger,
  useClipboard,
  useClipboardContext,
  type ClipboardCopyStatusDetails,
  type ClipboardIndicatorProps,
  type ClipboardRootProps,
  type ClipboardValueChangeDetails,
  type UseClipboardProps,
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

export type ClipboardValueAccepted = ExpectTrue<
  Assignable<{ value: string; timeout: number }, UseClipboardProps>
>;
export type ClipboardInvalidValueRejected = ExpectFalse<
  Assignable<{ value: number }, UseClipboardProps>
>;
export type ClipboardCopiedContentAccepted = ExpectTrue<
  Assignable<{ copied: string }, Pick<ClipboardIndicatorProps, 'copied'>>
>;
export type ClipboardRootNativePropsAccepted = ExpectTrue<
  Assignable<{ value: string; title: string }, ClipboardRootProps>
>;
export type ClipboardCssObjectRejected = ExpectFalse<
  Assignable<{ css: { padding: string } }, ClipboardRootProps>
>;

/** Check named hooks and the callback detail types from the archive. */
function ConsumerContext(): JSX.Element {
  const machine = useClipboardContext();
  return <output>{machine().value}</output>;
}

/** Compile the compound and named Clipboard API in an isolated Solid app. */
export function PackedClipboardTypes(): JSX.Element {
  /** Check the public status callback detail. */
  function reportStatus(details: ClipboardCopyStatusDetails): void {
    if (details.copied) return;
  }

  /** Check the public value callback detail. */
  function reportValue(details: ClipboardValueChangeDetails): void {
    if (details.value) return;
  }

  const machine = useClipboard({
    value: 'Typed Clipboard value',
    onStatusChange: reportStatus,
    onValueChange: reportValue,
  });

  return (
    <>
      <Clipboard.PropsProvider value={{ timeout: 1000 }}>
        <Clipboard.RootProvider value={machine} class="clipboard-typed-root">
          <Clipboard.Label>Copy typed value</Clipboard.Label>
          <Clipboard.Input />
          <ClipboardTrigger>
            <ClipboardIndicator />
            <Clipboard.CopyText />
          </ClipboardTrigger>
          <ConsumerContext />
          <Clipboard.Context>
            {
              /** Read the same machine through the public render prop. */
              (api) => <output>{api().copied ? 'copied' : 'ready'}</output>
            }
          </Clipboard.Context>
        </Clipboard.RootProvider>
        <ClipboardRoot value="Named root value">
          <Clipboard.ValueText />
        </ClipboardRoot>
      </Clipboard.PropsProvider>
    </>
  );
}
