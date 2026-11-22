import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { PasswordInputCssContract } from './password-input-css-contract';

const meta = {
  title: 'Components/Password Input',
  component: PasswordInputCssContract,
} satisfies Meta<typeof PasswordInputCssContract>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CssContract: Story = { render: PasswordInputCssContract };
