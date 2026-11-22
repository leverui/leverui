import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderQrCodePart, type QrCodeRuntimePartProps } from './qr-code-part';
import type {
  QrCodeDownloadTriggerProps,
  QrCodeFrameProps,
  QrCodeOverlayProps,
  QrCodePatternProps,
} from './qr-code-props';

/** Render the QR SVG with a default machine-generated path. */
function QrCodeFrameImpl(props: QrCodeRuntimePartProps): JSX.Element {
  return renderQrCodePart(
    'frame',
    props,
    /** Give the frame a default Pattern child. */
    () => createComponent(QrCodePatternImpl, {}),
  );
}

/** Render the path supplied by Zag's QR encoding machine. */
function QrCodePatternImpl(props: QrCodeRuntimePartProps): JSX.Element {
  return renderQrCodePart('pattern', props);
}

/** Position consumer content over the QR code's center. */
function QrCodeOverlayImpl(props: QrCodeRuntimePartProps): JSX.Element {
  return renderQrCodePart('overlay', props);
}

/** Download the QR image through the primitive's machine action. */
function QrCodeDownloadTriggerImpl(props: QrCodeRuntimePartProps): JSX.Element {
  return renderQrCodePart('downloadTrigger', props);
}

/** Type frame attributes and refs against the selected native element. */
export const QrCodeFrame = QrCodeFrameImpl as <As extends PrimitiveNativeTag = 'svg'>(
  props: QrCodeFrameProps<As>,
) => JSX.Element;

/** Type pattern attributes and refs against the selected native element. */
export const QrCodePattern = QrCodePatternImpl as <As extends PrimitiveNativeTag = 'path'>(
  props: QrCodePatternProps<As>,
) => JSX.Element;

/** Type overlay attributes and refs against the selected native element. */
export const QrCodeOverlay = QrCodeOverlayImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: QrCodeOverlayProps<As>,
) => JSX.Element;

/** Type download attributes and refs against the selected native element. */
export const QrCodeDownloadTrigger = QrCodeDownloadTriggerImpl as <
  As extends PrimitiveNativeTag = 'button',
>(
  props: QrCodeDownloadTriggerProps<As>,
) => JSX.Element;
