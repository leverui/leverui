import {
  Button,
  DownloadTrigger,
  useDownload,
  type DownloadableData,
  type DownloadTriggerProps,
  type UseDownloadProps,
  type UseDownloadReturn,
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

export type CssObjectRejected = ExpectFalse<
  'css' extends keyof DownloadTriggerProps ? true : false
>;

export type TextDataAccepted = ExpectTrue<Assignable<string, DownloadableData>>;
export type BlobDataAccepted = ExpectTrue<Assignable<Blob, DownloadableData>>;
export type InvalidDataRejected = ExpectFalse<Assignable<number, DownloadableData>>;
export type NativePropsAccepted = ExpectTrue<
  Assignable<
    { data: string; fileName: string; mimeType: 'text/plain'; title: string },
    DownloadTriggerProps
  >
>;
export type MissingFileNameRejected = ExpectFalse<
  Assignable<{ data: string; mimeType: 'text/plain' }, DownloadTriggerProps>
>;
export type SelectedAnchorAccepted = ExpectTrue<
  Assignable<
    { data: string; fileName: string; mimeType: 'text/plain'; as: 'a'; href: string },
    DownloadTriggerProps<'a'>
  >
>;

/** Compile the installed component, child renderer, and standalone hook. */
export function PackedDownloadTriggerTypes(): JSX.Element {
  /** Preserve the native button ref in the public child form. */
  function captureButton(element: Element): void {
    element.setAttribute('data-packed-ref', 'true');
  }

  /** Render one styled child with the parent's native and event props. */
  const renderButton: NonNullable<DownloadTriggerProps['asChild']> = (getProps) => (
    <Button {...getProps()} variant="outline">
      Save file
    </Button>
  );
  const options: UseDownloadProps = {
    data: 'packed data',
    fileName: 'packed.txt',
    mimeType: 'text/plain',
  };
  const action: UseDownloadReturn = useDownload(options);

  return (
    <>
      <DownloadTrigger {...options} asChild={renderButton} ref={captureButton} />
      <button type="button" onClick={action.download}>
        Save with hook
      </button>
    </>
  );
}
