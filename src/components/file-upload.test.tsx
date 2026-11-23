import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { FileUpload, useFileUpload } from '../index';

afterEach(cleanup);

/** Verify native input, styled parts, standard items, and item deletion. */
async function verifiesFileUploadComposition(): Promise<void> {
  const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });
  render(
    /** Mount machine, recipe, and item parts in one Solid owner. */
    () => (
      <>
        <FileUpload.Root defaultAcceptedFiles={[file]} maxFiles={2} data-testid="upload-root">
          <FileUpload.Label>Attachments</FileUpload.Label>
          <FileUpload.HiddenInput data-testid="upload-input" />
          <FileUpload.Trigger>Choose files</FileUpload.Trigger>
          <FileUpload.Dropzone data-testid="upload-dropzone">
            <FileUpload.DropzoneContent>Drop files here</FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.FileText data-testid="file-text" />
          <FileUpload.List showSize clearable />
        </FileUpload.Root>
      </>
    ),
  );

  const root = screen.getByTestId('upload-root');
  const input = screen.getByTestId('upload-input') as HTMLInputElement;
  expect(root.className).toContain('lui-file-upload__root');
  expect(root.hasAttribute('data-file-upload-root')).toBe(true);
  expect(input.type).toBe('file');
  expect(screen.getByText('Attachments').tagName).toBe('LABEL');
  expect(screen.getByText('Choose files').tagName).toBe('BUTTON');
  expect(screen.getByTestId('upload-dropzone').hasAttribute('data-file-upload-dropzone')).toBe(
    true,
  );
  expect(screen.getByTestId('file-text').textContent).toBe('notes.txt');
  expect(screen.getAllByText('notes.txt')).toHaveLength(2);
  expect(root.querySelector('.lui-file-upload__itemPreview svg')).not.toBeNull();
  const remove = root.querySelector<HTMLButtonElement>('[data-file-upload-item-delete-trigger]');
  expect(remove).not.toBeNull();
  if (!remove) throw new Error('File Upload item has no delete trigger.');
  fireEvent.click(remove);
  await waitFor(
    /** Let Zag commit the deletion before checking the visible summary. */
    () => expect(screen.getByTestId('file-text').textContent).toBe('Select file(s)'),
  );
  expect(screen.getByTestId('file-text').getAttribute('data-placeholder')).toBe('');
  expect(root.querySelector('[data-file-upload-item]')).toBeNull();
}

it(
  'composes native and styled File Upload parts with removable items',
  verifiesFileUploadComposition,
);

/** Keep disabled, invalid, and required machine state reactive. */
function verifiesReactiveFileUploadState(): void {
  const [disabled, setDisabled] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  const [required, setRequired] = createSignal(false);

  /** Bind machine props to live Solid signals. */
  function Example(): JSX.Element {
    return (
      <>
        <FileUpload.Root disabled={disabled()} invalid={invalid()} required={required()}>
          <FileUpload.HiddenInput data-testid="reactive-upload-input" />
          <FileUpload.Trigger data-testid="reactive-upload-trigger">Choose</FileUpload.Trigger>
          <FileUpload.Dropzone data-testid="reactive-upload-dropzone">Drop</FileUpload.Dropzone>
        </FileUpload.Root>
      </>
    );
  }

  render(
    /** Mount the signal-driven machine once. */
    () => <Example />,
  );
  const input = screen.getByTestId('reactive-upload-input') as HTMLInputElement;
  const trigger = screen.getByTestId('reactive-upload-trigger') as HTMLButtonElement;
  expect(input.disabled).toBe(false);
  setDisabled(true);
  flush();
  setInvalid(true);
  flush();
  setRequired(true);
  flush();
  expect(input.disabled).toBe(true);
  expect(input.required).toBe(true);
  expect(trigger.disabled).toBe(true);
  expect(screen.getByTestId('reactive-upload-dropzone').getAttribute('data-disabled')).toBe('');
  setDisabled(false);
  flush();
  expect(input.disabled).toBe(false);
}

it('updates native controls when File Upload state changes', verifiesReactiveFileUploadState);

/** Verify caller-owned accessors retain the public compound context. */
async function verifiesCallerOwnedFileUpload(): Promise<void> {
  const file = new File(['x'], 'example.txt', { type: 'text/plain' });

  /** Create the caller-owned machine inside its Solid owner. */
  function Example(): JSX.Element {
    const upload = useFileUpload({ defaultAcceptedFiles: [file] });
    /** Clear files through the public accessor. */
    function clearFiles(): void {
      upload().clearFiles();
    }

    return (
      <>
        <FileUpload.RootProvider value={upload}>
          <FileUpload.HiddenInput />
          <FileUpload.Context>
            {
              /** Expose the current count from the nearest machine. */
              (context) => (
                <output data-testid="file-count">{context().acceptedFiles.length}</output>
              )
            }
          </FileUpload.Context>
          <FileUpload.ItemGroup>
            <FileUpload.Items />
          </FileUpload.ItemGroup>
          <button type="button" onClick={clearFiles}>
            Clear externally
          </button>
        </FileUpload.RootProvider>
      </>
    );
  }

  render(
    /** Mount the caller-owned provider. */
    () => <Example />,
  );
  expect(screen.getByTestId('file-count').textContent).toBe('1');
  expect(screen.getByText('example.txt')).toBeTruthy();
  fireEvent.click(screen.getByText('Clear externally'));
  await waitFor(
    /** Let the caller-owned machine publish its next state. */
    () => expect(screen.getByTestId('file-count').textContent).toBe('0'),
  );
  expect(screen.queryByText('example.txt')).toBeNull();
}

it('supports an externally owned File Upload accessor', verifiesCallerOwnedFileUpload);

/** Keep FileText's summary authoritative while honoring caller data attributes. */
function verifiesFileTextPropPriority(): void {
  render(
    /** Mount both empty and selected states to check the prop order. */
    () => (
      <>
        <FileUpload.Root>
          <FileUpload.FileText
            data-testid="custom-file-text"
            data-scope="consumer-scope"
            data-part="consumer-part"
            data-placeholder="consumer-placeholder"
            fallback="Choose a document"
          >
            Ignored child
          </FileUpload.FileText>
        </FileUpload.Root>
      </>
    ),
  );
  const text = screen.getByTestId('custom-file-text');
  expect(text.textContent).toBe('Choose a document');
  expect(text.getAttribute('data-scope')).toBe('consumer-scope');
  expect(text.getAttribute('data-part')).toBe('consumer-part');
  expect(text.getAttribute('data-placeholder')).toBe('consumer-placeholder');
}

it('uses the FileText prop precedence', verifiesFileTextPropPriority);
