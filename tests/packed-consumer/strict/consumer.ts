import type { BoxProps, ButtonProps } from '@leverui/components';

export const box: BoxProps = {
  class: 'consumer-brand-space',
  style: { padding: '37px', 'border-color': 'var(--leverui-colors-blue-500)' },
  children: 'Strict',
};

export const button: ButtonProps = {
  class: 'consumer-brand-button',
  variant: 'solid',
  children: 'Strict button',
};

// @ts-expect-error Native Box props reject styled-system spacing shorthands.
export const invalidBox: BoxProps = { p: '37px' };
// @ts-expect-error Native Box props reject arbitrary style-object CSS.
export const invalidCss: BoxProps = { css: { p: '4' } };
// @ts-expect-error Native Button props reject unsupported custom utility names.
export const invalidUtility: ButtonProps = { brandSpace: 'compact' };
