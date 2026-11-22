import {
  FileUpload,
  useFileUpload,
  type FileUploadDropzoneProps,
  type FileUploadItemProps,
  type FileUploadRootProps,
  type FileUploadRootProviderProps,
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

export type NativeRootRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLDivElement) => void }, FileUploadRootProps>
>;
export type SelectedRootRefAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: Element) => void }, FileUploadRootProps<'section'>>
>;
export type WrongSelectedRootRefRejected = ExpectFalse<
  Assignable<
    { as: 'section'; ref: (element: HTMLDivElement) => void },
    FileUploadRootProps<'section'>
  >
>;
export type RootProviderValueRequired = ExpectFalse<
  Assignable<{ value?: never }, FileUploadRootProviderProps>
>;
export type ItemRequiresFile = ExpectFalse<Assignable<{ file?: never }, FileUploadItemProps>>;
export type SelectedAnchorAttributesAccepted = ExpectTrue<
  Assignable<{ as: 'a'; href: '#files' }, FileUploadDropzoneProps<'a'>>
>;
export type ChildAndSelectedTagRejected = ExpectFalse<
  Assignable<
    { as: 'a'; asChild: NonNullable<FileUploadDropzoneProps['asChild']> },
    FileUploadDropzoneProps<'a'>
  >
>;
export type RootCssPropRejected = ExpectFalse<
  'css' extends keyof FileUploadRootProps ? true : false
>;
export type RootRecipePropRejected = ExpectFalse<
  'recipe' extends keyof FileUploadRootProps ? true : false
>;
export type RootStyleShorthandRejected = ExpectFalse<
  'bg' extends keyof FileUploadRootProps ? true : false
>;
export type PartCssPropRejected = ExpectFalse<
  'css' extends keyof FileUploadDropzoneProps ? true : false
>;
export type NativeClassAccepted = ExpectTrue<
  Assignable<{ class: 'custom-upload' }, FileUploadRootProps>
>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: '100%' } }, FileUploadRootProps>
>;

/** Verify selected-anchor event targets in the installed package. */
function onAnchorClick(event: MouseEvent & { currentTarget: HTMLAnchorElement }): void {
  event.preventDefault();
}

/** Compile the caller-owned file machine from an installed package. */
export function typedFileUpload(): JSX.Element {
  const upload = useFileUpload({ maxFiles: 2 });
  return (
    <FileUpload.RootProvider value={upload}>
      <FileUpload.Label>Typed documents</FileUpload.Label>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger>Choose</FileUpload.Trigger>
      <FileUpload.Dropzone as="a" href="#files" onClick={onAnchorClick}>
        Drop files
      </FileUpload.Dropzone>
      <FileUpload.List clearable />
    </FileUpload.RootProvider>
  );
}

/** Compile a caller-owned anchor child against the published primitive adapter. */
export function typedChildDropzone(): JSX.Element {
  return (
    <FileUpload.Dropzone
      asChild={
        /** Keep machine attributes on the selected native anchor. */
        (getProps) => (
          <a {...getProps()} href="#files">
            Drop files
          </a>
        )
      }
    />
  );
}
