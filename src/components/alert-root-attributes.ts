import { alertInlineAttributes, readAlertInline } from './alert-inline';
import { alertSizeAttributes, readAlertSize } from './alert-size';
import { alertStatusAttributes, readAlertPalette, readAlertStatus } from './alert-status';
import { alertVariantAttributes, readAlertVariant } from './alert-variant';

type AlertChoice = 'status' | 'size' | 'variant' | 'inline';
type AlertBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AlertAttribute =
  | `data-${AlertChoice}`
  | `data-${AlertChoice}-${AlertBreakpoint}`
  | 'data-leverui-color-palette'
  | 'data-unstyled';
export type AlertRootAttributes = Partial<Record<AlertAttribute, string | undefined>>;

interface AlertAppearanceChoices {
  status?: unknown;
  variant?: unknown;
  size?: unknown;
  inline?: unknown;
  colorPalette?: unknown;
}

/** Reflect validated Alert choices as native CSS selectors. */
export function alertRootAttributes(
  choices: AlertAppearanceChoices,
  unstyled: boolean | undefined,
): AlertRootAttributes {
  return {
    ...alertSizeAttributes(readAlertSize(choices.size)),
    ...alertVariantAttributes(readAlertVariant(choices.variant)),
    ...alertInlineAttributes(readAlertInline(choices.inline)),
    ...alertStatusAttributes(readAlertStatus(choices.status)),
    'data-leverui-color-palette': readAlertPalette(choices.colorPalette),
    'data-unstyled': unstyled ? '' : undefined,
  };
}
