import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FileUpload } from '../src';

/** Render machine-rejected files through the public rejected item group. */
function FileUploadRejectedExample(): JSX.Element {
  return (
    <>
      <FileUpload.Root accept="text/plain">
        <FileUpload.HiddenInput data-testid="rejected-input" />
        <FileUpload.Context>
          {
            /** Track the machine's rejection list without copying it. */
            (context) => (
              <FileUpload.ItemGroup type="rejected" data-testid="rejected-group">
                <For each={context().rejectedFiles}>
                  {
                    /** Bind each rejected File to the primitive's rejected item context. */
                    (rejection) => (
                      <FileUpload.Item file={rejection.file}>
                        <FileUpload.ItemName />
                      </FileUpload.Item>
                    )
                  }
                </For>
              </FileUpload.ItemGroup>
            )
          }
        </FileUpload.Context>
      </FileUpload.Root>
    </>
  );
}

const meta = {
  title: 'Components/File Upload Rejected',
  component: FileUploadRejectedExample,
} satisfies Meta<typeof FileUploadRejectedExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Rejected: Story = {};
