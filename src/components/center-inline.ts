import {
  readResponsiveBooleans,
  type ResponsiveBreakpoint,
  type ResponsiveBooleanValue,
} from '../styled-system/responsive-values';

export type CenterInline = ResponsiveBooleanValue;
type InlineAttributeName = 'data-inline' | `data-inline-${Exclude<ResponsiveBreakpoint, 'base'>}`;

/** Put ordinary breakpoint choices on a native Center element. */
export function centerInlineAttributes(
  inline: CenterInline | undefined,
): Record<InlineAttributeName, string | undefined> {
  const values = readResponsiveBooleans(inline);
  if (!values) throw new Error('Center inline requires a supported breakpoint selection.');
  return {
    'data-inline': values.base === true ? 'true' : 'false',
    'data-inline-sm': values.sm === undefined ? undefined : String(values.sm),
    'data-inline-md': values.md === undefined ? undefined : String(values.md),
    'data-inline-lg': values.lg === undefined ? undefined : String(values.lg),
    'data-inline-xl': values.xl === undefined ? undefined : String(values.xl),
    'data-inline-2xl': values['2xl'] === undefined ? undefined : String(values['2xl']),
  };
}
