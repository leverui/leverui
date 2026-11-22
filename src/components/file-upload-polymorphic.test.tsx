import { cleanup, render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { FileUpload } from '../index';

afterEach(cleanup);

/** Preserve machine attributes on selected and caller-owned native anchors. */
function verifiesSelectedDropzones(): void {
  render(
    /** Mount both polymorphic paths under one File Upload machine. */
    () => (
      <>
        <FileUpload.Root>
          <FileUpload.Dropzone as="a" href="#selected" data-testid="selected-dropzone">
            Selected anchor
          </FileUpload.Dropzone>
          <FileUpload.Dropzone
            asChild={
              /** Merge the primitive's interaction props into a caller-owned anchor. */
              (getProps): JSX.Element => (
                <a {...getProps()} href="#child" data-testid="child-dropzone">
                  Child anchor
                </a>
              )
            }
          />
        </FileUpload.Root>
      </>
    ),
  );

  const selected = screen.getByTestId('selected-dropzone');
  const child = screen.getByTestId('child-dropzone');
  expect(selected.tagName).toBe('A');
  expect(selected.getAttribute('href')).toBe('#selected');
  expect(selected.hasAttribute('data-file-upload-dropzone')).toBe(true);
  expect(child.tagName).toBe('A');
  expect(child.getAttribute('href')).toBe('#child');
  expect(child.hasAttribute('data-file-upload-dropzone')).toBe(true);
}

it('keeps selected and asChild dropzones on native anchors', verifiesSelectedDropzones);
