import type { BoxProps, ButtonProps } from '@leverui/components';

export const brandColor = '--lui-colors-brand-500' as const;
export const brandSelector = '[data-brand]' as const;
export const button: ButtonProps = {
  variant: 'solid',
  class: 'consumer-brand-button',
  children: 'Save',
};
// @ts-expect-error Button variants are finite CSS choices, not custom recipe extensions.
export const invalidButton: ButtonProps = { variant: 'brand', children: 'Save' };
export const box: BoxProps = {
  class: 'consumer-brand-space',
  style: { 'margin-left': 'var(--lui-spacing-1)' },
  children: 'Space',
};
// @ts-expect-error Native Box props do not accept the unsupported object-style API.
export const invalidBoxCss: BoxProps = { css: { padding: '4px' }, children: 'Space' };
