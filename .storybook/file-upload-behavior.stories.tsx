import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FileUploadAttributesExample } from './file-upload-attributes-example';
import { FileUploadControlledExample } from './file-upload-controlled-example';
import { FileUploadCountExample } from './file-upload-count-example';
import { FileUploadFormExample } from './file-upload-form-example';
import { FileUploadValidationExample } from './file-upload-validation-example';

const meta = { title: 'Components/File Upload Behavior' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Validation: Story = { render: FileUploadValidationExample };
export const Controlled: Story = { render: FileUploadControlledExample };
export const Form: Story = { render: FileUploadFormExample };
export const Attributes: Story = { render: FileUploadAttributesExample };
export const Count: Story = { render: FileUploadCountExample };
