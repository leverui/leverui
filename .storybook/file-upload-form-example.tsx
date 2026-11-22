import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Field, FileUpload } from '../src';

/** Exercise native form and field semantics with selected element adapters. */
export function FileUploadFormExample(): JSX.Element {
  const [readonly, setReadonly] = createSignal(false);
  const [defaultDisabled, setDefaultDisabled] = createSignal(false);
  const [refEvents, setRefEvents] = createSignal<string[]>([]);

  /** Append a ref or pointer observation to the visible event log. */
  function recordEvent(event: string): void {
    /** Preserve earlier observations when adding the latest one. */
    function appendEvent(events: string[]): string[] {
      return [...events, event];
    }
    setRefEvents(appendEvent);
  }

  /** Record selected root and part refs without remounting the input. */
  function recordRef(part: string): (element: Element) => void {
    /** Record the selected element's actual native tag. */
    function onRef(element: Element): void {
      recordEvent(`${part}:${element.tagName}`);
    }
    return onRef;
  }

  /** Track pointer forwarding on the selected root element. */
  function onRootMouseEnter(): void {
    recordEvent('root:hover');
  }

  /** Track pointer forwarding on the selected dropzone element. */
  function onDropzoneMouseEnter(): void {
    recordEvent('dropzone:hover');
  }

  /** Read the current provider default in a tracked expression. */
  function readDefaults(): { disabled: boolean } {
    return { disabled: defaultDisabled() };
  }

  /** Toggle the machine's readonly policy. */
  function toggleReadonly(): void {
    setReadonly(!readonly());
  }

  /** Toggle the inherited disabled default. */
  function toggleDefaultDisabled(): void {
    setDefaultDisabled(!defaultDisabled());
  }

  /** Submit the native form and expose the selected file name. */
  function submitForm(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;
    const file = new FormData(form).get('attachment');
    const result = form.querySelector('output');
    if (result) result.textContent = file instanceof File ? file.name : String(file);
  }

  return (
    <>
      <FileUpload.PropsProvider value={readDefaults}>
        <form onSubmit={submitForm}>
          <Field.Root id="attachment-field" invalid required>
            <Field.Label>Attachment</Field.Label>
            <FileUpload.Root
              as="section"
              ref={recordRef('root')}
              onMouseEnter={onRootMouseEnter}
              readOnly={readonly()}
              name="attachment"
            >
              <FileUpload.Label data-testid="form-upload-label">
                Choose an attachment
              </FileUpload.Label>
              <FileUpload.HiddenInput data-testid="form-upload-input" />
              <FileUpload.Dropzone
                as="article"
                ref={recordRef('dropzone')}
                onMouseEnter={onDropzoneMouseEnter}
                data-testid="form-dropzone"
              >
                Drop attachment
              </FileUpload.Dropzone>
              <FileUpload.Trigger data-testid="form-trigger">Browse files</FileUpload.Trigger>
              <FileUpload.FileText />
            </FileUpload.Root>
            <Field.HelperText>Choose one file</Field.HelperText>
            <Field.ErrorText>Attachment is required</Field.ErrorText>
          </Field.Root>
          <button type="submit">Submit attachment</button>
          <output data-testid="form-result" />
        </form>
      </FileUpload.PropsProvider>
      <button type="button" onClick={toggleReadonly} data-testid="toggle-readonly">
        Toggle readonly
      </button>
      <button type="button" onClick={toggleDefaultDisabled} data-testid="toggle-default-disabled">
        Toggle default disabled
      </button>
      <output data-testid="selected-refs">{refEvents().join('|')}</output>
    </>
  );
}
