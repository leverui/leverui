import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface QrCodeAppearanceState {
  unstyled: Accessor<boolean>;
}

const QrCodeAppearanceContext = createOptionalContext<QrCodeAppearanceState>();

/** Share the nearest QR root's live appearance choice. */
export const QrCodeAppearanceProvider = QrCodeAppearanceContext;

/** Require QR parts to belong to an active machine root. */
export function useQrCodeAppearance(): QrCodeAppearanceState {
  const state = useOptionalContext(QrCodeAppearanceContext);
  if (!state) throw new Error('QrCode parts require QrCodeRoot or QrCodeRootProvider.');
  return state;
}
